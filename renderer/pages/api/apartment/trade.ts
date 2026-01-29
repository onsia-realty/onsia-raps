import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import type { ApartmentTradeItem, PublicApiResponse } from '../../../lib/publicApi';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
});

// 환경변수에서 API 키 가져오기
const API_KEY = process.env.PUBLIC_DATA_API_KEY || '';

// 국토부 아파트 실거래가 API
const API_URL = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev';

interface TradeApiResponse {
  success: boolean;
  data?: ApartmentTradeItem[];
  totalCount?: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TradeApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { lawd_cd, deal_ymd, page_no = '1', num_of_rows = '100' } = req.query;

  if (!lawd_cd || !deal_ymd) {
    return res.status(400).json({
      success: false,
      error: '필수 파라미터가 누락되었습니다. (lawd_cd, deal_ymd)',
    });
  }

  if (!API_KEY) {
    // API 키가 없으면 샘플 데이터 반환 (개발용)
    return res.status(200).json({
      success: true,
      data: getSampleData(),
      totalCount: 10,
    });
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        serviceKey: decodeURIComponent(API_KEY),
        LAWD_CD: lawd_cd,
        DEAL_YMD: deal_ymd,
        pageNo: page_no,
        numOfRows: num_of_rows,
      },
      timeout: 30000,
    });

    const parsed = xmlParser.parse(response.data) as PublicApiResponse<ApartmentTradeItem>;

    if (parsed.response?.header?.resultCode !== '00') {
      return res.status(400).json({
        success: false,
        error: parsed.response?.header?.resultMsg || 'API 오류',
      });
    }

    const items = parsed.response?.body?.items?.item;
    const dataArray = Array.isArray(items) ? items : items ? [items] : [];

    return res.status(200).json({
      success: true,
      data: dataArray,
      totalCount: parsed.response?.body?.totalCount || 0,
    });
  } catch (error) {
    console.error('아파트 실거래가 API 오류:', error);
    return res.status(500).json({
      success: false,
      error: '데이터를 가져오는 중 오류가 발생했습니다.',
    });
  }
}

// 개발용 샘플 데이터
function getSampleData(): ApartmentTradeItem[] {
  return [
    {
      거래금액: '180,000',
      거래유형: '중개거래',
      건축년도: 2015,
      년: 2024,
      도로명: '테헤란로 123',
      도로명건물본번호코드: '0123',
      도로명건물부번호코드: '0000',
      도로명시군구코드: '11680',
      도로명일련번호코드: '01',
      도로명코드: '4161031',
      법정동: '역삼동',
      법정동본번코드: '0654',
      법정동부번코드: '0000',
      법정동시군구코드: '11680',
      법정동읍면동코드: '10300',
      법정동지번코드: '1',
      아파트: '래미안 역삼',
      월: 12,
      일: 15,
      일련번호: '11680-1',
      전용면적: 84.95,
      중개사소재지: '서울 강남구',
      지번: '654',
      지역코드: '11680',
      층: 15,
      해제사유발생일: '',
      해제여부: '',
    },
    {
      거래금액: '145,000',
      거래유형: '중개거래',
      건축년도: 2010,
      년: 2024,
      도로명: '역삼로 45',
      도로명건물본번호코드: '0045',
      도로명건물부번호코드: '0000',
      도로명시군구코드: '11680',
      도로명일련번호코드: '02',
      도로명코드: '4161032',
      법정동: '역삼동',
      법정동본번코드: '0789',
      법정동부번코드: '0000',
      법정동시군구코드: '11680',
      법정동읍면동코드: '10300',
      법정동지번코드: '1',
      아파트: '역삼 자이',
      월: 12,
      일: 10,
      일련번호: '11680-2',
      전용면적: 59.98,
      중개사소재지: '서울 강남구',
      지번: '789',
      지역코드: '11680',
      층: 8,
      해제사유발생일: '',
      해제여부: '',
    },
    {
      거래금액: '220,000',
      거래유형: '중개거래',
      건축년도: 2020,
      년: 2024,
      도로명: '논현로 200',
      도로명건물본번호코드: '0200',
      도로명건물부번호코드: '0000',
      도로명시군구코드: '11680',
      도로명일련번호코드: '03',
      도로명코드: '4161033',
      법정동: '삼성동',
      법정동본번코드: '0111',
      법정동부번코드: '0000',
      법정동시군구코드: '11680',
      법정동읍면동코드: '10400',
      법정동지번코드: '1',
      아파트: '삼성 힐스테이트',
      월: 11,
      일: 25,
      일련번호: '11680-3',
      전용면적: 114.52,
      중개사소재지: '서울 강남구',
      지번: '111',
      지역코드: '11680',
      층: 22,
      해제사유발생일: '',
      해제여부: '',
    },
  ];
}
