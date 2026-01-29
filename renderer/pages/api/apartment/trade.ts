import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
});

// 환경변수에서 API 키 가져오기
const API_KEY = process.env.DATA_GO_KR_API_KEY || '';

// 국토부 아파트 실거래가 API
// 상세자료: https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev
// 기본자료: https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade
const API_URL = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade';

export interface ApartmentTradeResponse {
  success: boolean;
  data?: TransformedTradeItem[];
  totalCount?: number;
  error?: string;
  params?: {
    lawdCd: string;
    dealYmd: string;
  };
}

// 변환된 거래 데이터 타입
export interface TransformedTradeItem {
  id: string;
  아파트: string;
  법정동: string;
  지번: string;
  전용면적: number;
  평수: number;
  층: number;
  건축년도: number;
  거래금액: number;
  거래금액표시: string;
  거래일: string;
  거래유형: string;
  해제여부: boolean;
}

/**
 * 금액을 한글 표기로 변환 (억/만원)
 */
function formatPrice(price: number): string {
  if (price >= 10000) {
    const eok = Math.floor(price / 10000);
    const man = price % 10000;
    if (man === 0) {
      return `${eok}억`;
    }
    return `${eok}억 ${man.toLocaleString()}만`;
  }
  return `${price.toLocaleString()}만`;
}

/**
 * 전용면적(㎡)을 평으로 변환
 */
function sqmToPyeong(sqm: number): number {
  return Math.round(sqm / 3.3058 * 10) / 10;
}

/**
 * 금액 문자열을 숫자로 변환 (쉼표 제거)
 */
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/,/g, '').trim(), 10) || 0;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApartmentTradeResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { lawd_cd, deal_ymd, page_no = '1', num_of_rows = '100' } = req.query;

  if (!lawd_cd || !deal_ymd) {
    return res.status(400).json({
      success: false,
      error: '필수 파라미터가 누락되었습니다. (lawd_cd: 지역코드 5자리, deal_ymd: 계약년월 YYYYMM)',
    });
  }

  const lawdCd = String(lawd_cd);
  const dealYmd = String(deal_ymd);

  // 파라미터 유효성 검사
  if (!/^\d{5}$/.test(lawdCd)) {
    return res.status(400).json({
      success: false,
      error: 'lawd_cd는 5자리 숫자여야 합니다.',
    });
  }

  if (!/^\d{6}$/.test(dealYmd)) {
    return res.status(400).json({
      success: false,
      error: 'deal_ymd는 6자리 숫자(YYYYMM)여야 합니다.',
    });
  }

  if (!API_KEY) {
    // API 키가 없으면 샘플 데이터 반환 (개발용)
    console.log('[API] API 키 없음 - 샘플 데이터 반환');
    return res.status(200).json({
      success: true,
      data: getSampleData(),
      totalCount: 10,
      params: { lawdCd, dealYmd },
    });
  }

  try {
    console.log('[API] 아파트 매매 실거래가 조회:', { lawdCd, dealYmd });

    // URL 직접 구성 (onsia-mapiapp 방식)
    const requestUrl = `${API_URL}?serviceKey=${API_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&pageNo=${page_no}&numOfRows=${num_of_rows}`;
    console.log('[API] 요청 URL:', requestUrl.replace(API_KEY, 'API_KEY_HIDDEN'));

    const response = await axios.get(requestUrl, {
      timeout: 30000,
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const xmlText = response.data;

    // 디버깅: API 응답 로깅
    console.log('[API] 응답 데이터 (앞 500자):', typeof xmlText === 'string' ? xmlText.substring(0, 500) : xmlText);

    // 에러 체크 (성공 코드: 00, 000)
    const isSuccess = xmlText.includes('<resultCode>00</resultCode>') || xmlText.includes('<resultCode>000</resultCode>');
    if (xmlText.includes('<resultCode>') && !isSuccess) {
      const errorMatch = xmlText.match(/<resultMsg>(.*?)<\/resultMsg>/);
      const codeMatch = xmlText.match(/<resultCode>(.*?)<\/resultCode>/);
      console.log('[API] 에러 코드:', codeMatch?.[1], '메시지:', errorMatch?.[1]);
      return res.status(400).json({
        success: false,
        error: `API 오류: ${errorMatch ? errorMatch[1] : 'Unknown error'} (코드: ${codeMatch?.[1]})`,
      });
    }

    const parsed = xmlParser.parse(xmlText);

    // items 추출
    const items = parsed.response?.body?.items?.item;
    const dataArray = Array.isArray(items) ? items : items ? [items] : [];
    const totalCount = parsed.response?.body?.totalCount || dataArray.length;

    // 데이터 변환
    const transformedData: TransformedTradeItem[] = dataArray.map((item: any, index: number) => {
      const price = parsePrice(item.dealAmount || item.거래금액 || '0');
      const area = parseFloat(item.excluUseAr || item.전용면적) || 0;
      const year = item.dealYear || item.년 || '';
      const month = String(item.dealMonth || item.월 || '').padStart(2, '0');
      const day = String(item.dealDay || item.일 || '').padStart(2, '0');

      return {
        id: `trade-${lawdCd}-${dealYmd}-${index}`,
        아파트: item.aptNm || item.아파트 || '',
        법정동: item.umdNm || item.법정동 || '',
        지번: item.jibun || item.지번 || '',
        전용면적: area,
        평수: sqmToPyeong(area),
        층: parseInt(item.floor || item.층, 10) || 0,
        건축년도: parseInt(item.buildYear || item.건축년도, 10) || 0,
        거래금액: price,
        거래금액표시: formatPrice(price),
        거래일: `${year}-${month}-${day}`,
        거래유형: item.dealingGbn || item.거래유형 || '중개거래',
        해제여부: item.cdealType === 'O' || item.해제여부 === 'O',
      };
    });

    // 거래일 내림차순 정렬
    transformedData.sort((a, b) => b.거래일.localeCompare(a.거래일));

    return res.status(200).json({
      success: true,
      data: transformedData,
      totalCount,
      params: { lawdCd, dealYmd },
    });
  } catch (error) {
    console.error('[API] 아파트 실거래가 API 오류:', error);
    return res.status(500).json({
      success: false,
      error: '데이터를 가져오는 중 오류가 발생했습니다.',
    });
  }
}

// 개발용 샘플 데이터
function getSampleData(): TransformedTradeItem[] {
  return [
    {
      id: 'sample-1',
      아파트: '래미안 원베일리',
      법정동: '반포동',
      지번: '1-1',
      전용면적: 84.95,
      평수: 25.7,
      층: 15,
      건축년도: 2021,
      거래금액: 425000,
      거래금액표시: '42억 5,000만',
      거래일: '2026-01-15',
      거래유형: '중개거래',
      해제여부: false,
    },
    {
      id: 'sample-2',
      아파트: '아크로리버파크',
      법정동: '반포동',
      지번: '2-1',
      전용면적: 129.67,
      평수: 39.2,
      층: 28,
      건축년도: 2016,
      거래금액: 580000,
      거래금액표시: '58억',
      거래일: '2026-01-12',
      거래유형: '중개거래',
      해제여부: false,
    },
    {
      id: 'sample-3',
      아파트: '잠실엘스',
      법정동: '잠실동',
      지번: '40',
      전용면적: 84.82,
      평수: 25.6,
      층: 22,
      건축년도: 2008,
      거래금액: 285000,
      거래금액표시: '28억 5,000만',
      거래일: '2026-01-10',
      거래유형: '중개거래',
      해제여부: false,
    },
    {
      id: 'sample-4',
      아파트: '헬리오시티',
      법정동: '가락동',
      지번: '150',
      전용면적: 84.98,
      평수: 25.7,
      층: 35,
      건축년도: 2018,
      거래금액: 198000,
      거래금액표시: '19억 8,000만',
      거래일: '2026-01-08',
      거래유형: '중개거래',
      해제여부: false,
    },
    {
      id: 'sample-5',
      아파트: '마포래미안푸르지오',
      법정동: '아현동',
      지번: '774',
      전용면적: 59.97,
      평수: 18.1,
      층: 18,
      건축년도: 2014,
      거래금액: 158000,
      거래금액표시: '15억 8,000만',
      거래일: '2026-01-05',
      거래유형: '직거래',
      해제여부: false,
    },
  ];
}
