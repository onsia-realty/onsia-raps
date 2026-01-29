import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';

// 공공데이터 API 응답을 JSON으로 변환하는 클라이언트
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
});

// API 베이스 URL
const API_BASE = {
  // 국토교통부 실거래가 공개시스템
  MOLIT_TRADE: 'http://openapi.molit.go.kr/OpenAPI_ToolInstall498/service/rest/RTMSDataSvcAptTradeDev',
  MOLIT_RENT: 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSDataSvcAptRent',
  // 청약홈
  APPLYHOME: 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1',
  // 한국부동산원
  REB: 'https://www.reb.or.kr/r-one/openapi',
};

// XML → JSON 변환 함수
export function parseXmlResponse<T>(xmlData: string): T {
  const parsed = xmlParser.parse(xmlData);
  return parsed as T;
}

// 공공데이터 API 공통 응답 타입
export interface PublicApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: T | T[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 아파트 실거래가 데이터 타입
export interface ApartmentTradeItem {
  거래금액: string;
  거래유형: string;
  건축년도: number;
  년: number;
  도로명: string;
  도로명건물본번호코드: string;
  도로명건물부번호코드: string;
  도로명시군구코드: string;
  도로명일련번호코드: string;
  도로명코드: string;
  법정동: string;
  법정동본번코드: string;
  법정동부번코드: string;
  법정동시군구코드: string;
  법정동읍면동코드: string;
  법정동지번코드: string;
  아파트: string;
  월: number;
  일: number;
  일련번호: string;
  전용면적: number;
  중개사소재지: string;
  지번: string;
  지역코드: string;
  층: number;
  해제사유발생일: string;
  해제여부: string;
}

// 아파트 전월세 데이터 타입
export interface ApartmentRentItem {
  건축년도: number;
  계약구분: string;
  계약기간: string;
  년: number;
  법정동: string;
  보증금액: string;
  아파트: string;
  월: number;
  월세금액: string;
  일: number;
  전용면적: number;
  종전계약보증금: string;
  종전계약월세: string;
  지역코드: string;
  층: number;
}

// 지역코드 타입
export interface RegionCode {
  code: string;
  name: string;
  parentCode?: string;
}

// 시도 코드 목록
export const SIDO_CODES: RegionCode[] = [
  { code: '11', name: '서울특별시' },
  { code: '26', name: '부산광역시' },
  { code: '27', name: '대구광역시' },
  { code: '28', name: '인천광역시' },
  { code: '29', name: '광주광역시' },
  { code: '30', name: '대전광역시' },
  { code: '31', name: '울산광역시' },
  { code: '36', name: '세종특별자치시' },
  { code: '41', name: '경기도' },
  { code: '43', name: '충청북도' },
  { code: '44', name: '충청남도' },
  { code: '46', name: '전라남도' },
  { code: '47', name: '경상북도' },
  { code: '48', name: '경상남도' },
  { code: '50', name: '제주특별자치도' },
  { code: '51', name: '강원특별자치도' },
  { code: '52', name: '전북특별자치도' },
];

// 서울시 구 코드 목록 (예시)
export const SEOUL_GUGUN_CODES: RegionCode[] = [
  { code: '11110', name: '종로구', parentCode: '11' },
  { code: '11140', name: '중구', parentCode: '11' },
  { code: '11170', name: '용산구', parentCode: '11' },
  { code: '11200', name: '성동구', parentCode: '11' },
  { code: '11215', name: '광진구', parentCode: '11' },
  { code: '11230', name: '동대문구', parentCode: '11' },
  { code: '11260', name: '중랑구', parentCode: '11' },
  { code: '11290', name: '성북구', parentCode: '11' },
  { code: '11305', name: '강북구', parentCode: '11' },
  { code: '11320', name: '도봉구', parentCode: '11' },
  { code: '11350', name: '노원구', parentCode: '11' },
  { code: '11380', name: '은평구', parentCode: '11' },
  { code: '11410', name: '서대문구', parentCode: '11' },
  { code: '11440', name: '마포구', parentCode: '11' },
  { code: '11470', name: '양천구', parentCode: '11' },
  { code: '11500', name: '강서구', parentCode: '11' },
  { code: '11530', name: '구로구', parentCode: '11' },
  { code: '11545', name: '금천구', parentCode: '11' },
  { code: '11560', name: '영등포구', parentCode: '11' },
  { code: '11590', name: '동작구', parentCode: '11' },
  { code: '11620', name: '관악구', parentCode: '11' },
  { code: '11650', name: '서초구', parentCode: '11' },
  { code: '11680', name: '강남구', parentCode: '11' },
  { code: '11710', name: '송파구', parentCode: '11' },
  { code: '11740', name: '강동구', parentCode: '11' },
];

// 날짜 포맷 함수 (YYYYMM)
export function formatYearMonth(year: number, month: number): string {
  return `${year}${month.toString().padStart(2, '0')}`;
}

// 금액 포맷 함수 (만원 단위)
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/,/g, ''), 10) : price;
  if (numPrice >= 10000) {
    const billion = Math.floor(numPrice / 10000);
    const million = numPrice % 10000;
    if (million === 0) {
      return `${billion}억`;
    }
    return `${billion}억 ${million.toLocaleString()}만`;
  }
  return `${numPrice.toLocaleString()}만`;
}

// 면적 포맷 함수 (평 환산)
export function formatArea(sqm: number): string {
  const pyeong = (sqm / 3.3058).toFixed(1);
  return `${sqm.toFixed(2)}㎡ (${pyeong}평)`;
}

// API 클라이언트 생성
export const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 내부 API Route 호출 함수
export async function fetchFromApi<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const response = await apiClient.get(endpoint, { params });
  return response.data;
}
