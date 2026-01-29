import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import type { ApartmentRentItem, PublicApiResponse } from '../../../lib/publicApi';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
});

const API_KEY = process.env.PUBLIC_DATA_API_KEY || '';
const API_URL = 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSDataSvcAptRent/getRTMSDataSvcAptRent';

interface RentApiResponse {
  success: boolean;
  data?: ApartmentRentItem[];
  totalCount?: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RentApiResponse>
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
    return res.status(200).json({
      success: true,
      data: getSampleRentData(),
      totalCount: 5,
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

    const parsed = xmlParser.parse(response.data) as PublicApiResponse<ApartmentRentItem>;

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
    console.error('아파트 전월세 API 오류:', error);
    return res.status(500).json({
      success: false,
      error: '데이터를 가져오는 중 오류가 발생했습니다.',
    });
  }
}

function getSampleRentData(): ApartmentRentItem[] {
  return [
    {
      건축년도: 2015,
      계약구분: '신규',
      계약기간: '24.01~26.01',
      년: 2024,
      법정동: '역삼동',
      보증금액: '70,000',
      아파트: '래미안 역삼',
      월: 12,
      월세금액: '0',
      일: 15,
      전용면적: 84.95,
      종전계약보증금: '',
      종전계약월세: '',
      지역코드: '11680',
      층: 10,
    },
    {
      건축년도: 2010,
      계약구분: '갱신',
      계약기간: '24.02~26.02',
      년: 2024,
      법정동: '역삼동',
      보증금액: '10,000',
      아파트: '역삼 자이',
      월: 12,
      월세금액: '150',
      일: 20,
      전용면적: 59.98,
      종전계약보증금: '8,000',
      종전계약월세: '140',
      지역코드: '11680',
      층: 5,
    },
    {
      건축년도: 2020,
      계약구분: '신규',
      계약기간: '24.01~26.01',
      년: 2024,
      법정동: '삼성동',
      보증금액: '90,000',
      아파트: '삼성 힐스테이트',
      월: 11,
      월세금액: '0',
      일: 10,
      전용면적: 114.52,
      종전계약보증금: '',
      종전계약월세: '',
      지역코드: '11680',
      층: 18,
    },
  ];
}
