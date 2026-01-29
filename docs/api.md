# 부동산 공공데이터 API 가이드

## 부동산지인 데이터 소스 분류

### 🔴 유료/자체 데이터 (사용 불가)
| 데이터명 | 출처 | 비고 |
|---------|------|------|
| 시세정보 | 부동산지인 | 자체 분석 |
| 매물호가정보 | 부동산지인 | 자체 수집 |
| 수요/입주 시계열 | 부동산지인 | 자체 분석 |
| 공동주택 수요예측 정보 | 부동산지인 | 자체 분석 |
| 토지추정가 | 부동산지인 | 자체 분석 |
| 지역별 주거 노후도 | 부동산지인 | 자체 분석 |
| 지인 매수/매도 동향 | 부동산지인 | 자체 분석 |
| 3D 입주 폴리곤 | 부동산지인 | 자체 제작 |
| KB 시세/시계열 | KB부동산 | 유료 계약 필요 |
| KB 시장심리 지수 | KB부동산 | 유료 계약 필요 |

### 🟡 웹 스크래핑 데이터 (법적 검토 필요)
| 데이터명 | 출처 | 비고 |
|---------|------|------|
| 매물정보 | 네이버/직방 등 | 크롤링 필요 |
| 매물생존일 | 온라인 수집 | 크롤링 필요 |
| 중개사 매물통계 | 온라인 수집 | 크롤링 필요 |
| 부동산 뉴스 | 온라인 수집 | 크롤링 필요 |
| 마트/편의점/은행 정보 | 온라인 수집 | 크롤링 필요 |

### 🟢 무료 공공데이터 API (사용 가능)
아래 상세 목록 참조

---

## 사용 가능한 공공데이터 API 목록

### 1. 부동산 실거래가 (국토교통부)

#### 1.1 아파트 매매 실거래가 ⭐ (현재 사용중)
- **API 링크**: https://www.data.go.kr/data/15057511/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade`
- **갱신주기**: 매일
- **파라미터**:
  - `LAWD_CD`: 지역코드 (5자리)
  - `DEAL_YMD`: 계약년월 (YYYYMM)
- **응답 필드**: 아파트명, 법정동, 전용면적, 거래금액, 층, 건축년도, 거래일 등

```typescript
// 사용 예시
const response = await fetch(
  `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${API_KEY}&LAWD_CD=11680&DEAL_YMD=202412`
);
```

#### 1.2 아파트 전월세 실거래가 ⭐
- **API 링크**: https://www.data.go.kr/data/15058017/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent`
- **갱신주기**: 매일
- **파라미터**: 동일 (LAWD_CD, DEAL_YMD)
- **응답 필드**: 아파트명, 법정동, 전용면적, 보증금액, 월세금액, 층, 건축년도 등

#### 1.3 오피스텔 매매 실거래가
- **API 링크**: https://www.data.go.kr/data/15058452/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade`

#### 1.4 오피스텔 전월세 실거래가
- **API 링크**: https://www.data.go.kr/data/15058747/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcOffiRent/getRTMSDataSvcOffiRent`

#### 1.5 연립다세대 매매 실거래가
- **API 링크**: https://www.data.go.kr/data/15058038/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcRHTrade/getRTMSDataSvcRHTrade`

#### 1.6 연립다세대 전월세 실거래가
- **API 링크**: https://www.data.go.kr/data/15058016/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcRHRent/getRTMSDataSvcRHRent`

#### 1.7 단독/다가구 매매 실거래가
- **API 링크**: https://www.data.go.kr/data/15058022/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcSHTrade/getRTMSDataSvcSHTrade`

#### 1.8 단독/다가구 전월세 실거래가
- **API 링크**: https://www.data.go.kr/data/15058352/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcSHRent/getRTMSDataSvcSHRent`

#### 1.9 토지 실거래가
- **API 링크**: https://www.data.go.kr/data/15058034/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcLandTrade/getRTMSDataSvcLandTrade`

#### 1.10 상업/업무용 실거래가
- **API 링크**: https://www.data.go.kr/data/15058031/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcNrgTrade/getRTMSDataSvcNrgTrade`

#### 1.11 분양권 실거래가
- **API 링크**: https://www.data.go.kr/data/15058030/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade`

---

### 2. 청약 정보 (청약홈)

#### 2.1 아파트 분양정보 ⭐
- **API 링크**: https://www.data.go.kr/data/15098524/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/AptBasisInfoService1/getAphusBassInfo`
- **갱신주기**: 매일
- **응답 필드**: 주택명, 공급위치, 공급규모, 입주예정월, 분양가 등

#### 2.2 청약 경쟁률 정보
- **API 링크**: https://www.data.go.kr/data/15098543/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1613000/AptBasisInfoService1/getAphusMnAdmissPcInfo`
- **응답 필드**: 청약경쟁률, 당첨가점, 청약건수 등

#### 2.3 무순위/잔여세대 분양정보
- **API 링크**: https://www.data.go.kr/data/15098531/openapi.do

---

### 3. 주택/부동산 통계 (한국부동산원)

#### 3.1 주간 아파트 매매가격지수
- **API 링크**: https://www.data.go.kr/data/15059017/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1611000/AptPriceWeklyIdx/getAptPriceWeklyIdxList`
- **갱신주기**: 매주
- **응답 필드**: 지역명, 매매지수, 전세지수, 등락률 등

#### 3.2 월간 주택가격동향
- **API 링크**: https://www.data.go.kr/data/15059015/openapi.do
- **갱신주기**: 매월

#### 3.3 미분양 주택 현황
- **API 링크**: https://www.data.go.kr/data/15061068/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1611000/nsdi/UnsoldHouseService/attr/getUnsoldHouseList`
- **갱신주기**: 매월
- **응답 필드**: 지역, 미분양수, 준공후미분양 등

---

### 4. 인구/세대 통계 (행정안전부)

#### 4.1 주민등록 인구통계 ⭐
- **API 링크**: https://www.data.go.kr/data/15098931/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1741000/newHouseholdPopulation/householdPopulation`
- **갱신주기**: 매월
- **응답 필드**: 행정구역, 세대수, 인구수, 남자수, 여자수 등

#### 4.2 외국인 주민현황
- **API 링크**: https://www.data.go.kr/data/15077871/openapi.do

---

### 5. 금융/경제 지표 (한국은행)

#### 5.1 기준금리
- **API 링크**: https://ecos.bok.or.kr/api/
- **엔드포인트**: ECOS API (한국은행 경제통계시스템)
- **갱신주기**: 매월

#### 5.2 주택담보대출금리
- **API 링크**: https://ecos.bok.or.kr/api/
- **통계표코드**: 121Y015

#### 5.3 통화량 (M1, M2)
- **API 링크**: https://ecos.bok.or.kr/api/
- **통계표코드**: 101Y003

#### 5.4 소비자물가지수
- **API 링크**: https://ecos.bok.or.kr/api/
- **통계표코드**: 901Y009

---

### 6. 건축/인허가 (세움터, 통계청)

#### 6.1 건축인허가 정보
- **API 링크**: https://www.data.go.kr/data/15044658/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1611000/ArchPmsService`
- **갱신주기**: 매월

#### 6.2 주택착공 통계
- **API 링크**: https://www.data.go.kr/data/15044713/openapi.do
- **갱신주기**: 매월

---

### 7. 교육/학교 정보

#### 7.1 학교 기본정보 (학교알리미) ⭐
- **API 링크**: https://www.data.go.kr/data/15021095/openapi.do
- **엔드포인트**: `http://api.schoolinfo.go.kr/schoolInfo`
- **갱신주기**: 반기
- **응답 필드**: 학교명, 주소, 학교급, 설립유형 등

#### 7.2 학원정보
- **API 링크**: https://www.data.go.kr/data/15021087/openapi.do
- **갱신주기**: 반기

#### 7.3 어린이집 정보
- **API 링크**: https://www.data.go.kr/data/15004496/openapi.do
- **갱신주기**: 반기

---

### 8. 교통 정보

#### 8.1 지하철역 정보 ⭐
- **API 링크**: https://www.data.go.kr/data/15099316/openapi.do
- **갱신주기**: 변경시

#### 8.2 지하철 승하차 인원
- **API 링크**: https://www.data.go.kr/data/15048032/openapi.do (서울)
- **갱신주기**: 매월

#### 8.3 버스정류장 정보
- **API 링크**: https://www.data.go.kr/data/15067528/openapi.do
- **갱신주기**: 반기

---

### 9. 지리/공간 정보 (국가공간정보포털)

#### 9.1 행정구역 경계 (GeoJSON/SHP)
- **다운로드**: http://data.nsdi.go.kr/dataset/20180927ds0058
- **형식**: SHP, GeoJSON
- **갱신주기**: 변경시

#### 9.2 법정동 코드
- **API 링크**: https://www.data.go.kr/data/15063424/fileData.do
- **형식**: CSV 다운로드
- **갱신주기**: 변경시

#### 9.3 도로명주소 DB
- **다운로드**: https://business.juso.go.kr/addrlink/attrbDBDwld/attrbDBDwldList.do
- **형식**: TXT
- **갱신주기**: 매월

---

### 10. 부동산 규제/정책

#### 10.1 규제지역 지정현황
- **API 링크**: https://www.data.go.kr/data/15058462/openapi.do
- **갱신주기**: 변경시
- **응답 필드**: 지역명, 규제유형, 지정일, 해제일 등

#### 10.2 토지이용계획정보
- **API 링크**: https://www.data.go.kr/data/15056930/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/1611000/nsdi/LandUseService`

---

### 11. 생활편의시설

#### 11.1 도시공원 정보
- **API 링크**: https://www.data.go.kr/data/15012890/standard.do
- **갱신주기**: 수시

#### 11.2 병원/의료기관 정보
- **API 링크**: https://www.data.go.kr/data/15000736/openapi.do
- **갱신주기**: 매월

#### 11.3 대규모점포 정보
- **API 링크**: https://www.data.go.kr/data/15052418/openapi.do
- **갱신주기**: 반기

---

## API 활용 방법

### 1단계: API 키 발급
1. https://www.data.go.kr 회원가입
2. 원하는 API 상세페이지에서 "활용신청" 클릭
3. 신청 즉시 또는 1-2일 내 승인
4. 마이페이지 → API 키 확인

### 2단계: 환경변수 설정
```bash
# renderer/.env.local
DATA_GO_KR_API_KEY=your_api_key_here
```

### 3단계: API Route 생성
```typescript
// renderer/pages/api/[category]/[endpoint].ts
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const API_KEY = process.env.DATA_GO_KR_API_KEY;
const xmlParser = new XMLParser();

export default async function handler(req, res) {
  const response = await axios.get(`API_ENDPOINT?serviceKey=${API_KEY}&params...`);
  const parsed = xmlParser.parse(response.data);
  res.json({ success: true, data: parsed });
}
```

### 4단계: React Hook 생성
```typescript
// renderer/hooks/useApiData.ts
import { useQuery } from '@tanstack/react-query';

export function useApiData(endpoint, params, enabled = true) {
  return useQuery({
    queryKey: [endpoint, params],
    queryFn: () => fetch(`/api/${endpoint}?${new URLSearchParams(params)}`).then(r => r.json()),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
```

---

## 우선순위 구현 추천

### Phase 1 (필수 - 현재 진행중) ⭐
1. ✅ 아파트 매매 실거래가
2. 🔲 아파트 전월세 실거래가
3. 🔲 인구/세대수 통계

### Phase 2 (핵심 기능)
4. 오피스텔 매매/전월세
5. 청약 분양정보
6. 주간 아파트 가격지수
7. 미분양 현황

### Phase 3 (부가 기능)
8. 학교/학원 정보
9. 지하철역 정보
10. 금리/경제지표

### Phase 4 (고급 기능)
11. 행정구역 경계 (지도용)
12. 규제지역 정보
13. 건축인허가 통계

---

## 참고 링크

- **공공데이터포털**: https://www.data.go.kr
- **한국은행 ECOS**: https://ecos.bok.or.kr
- **국가공간정보포털**: http://data.nsdi.go.kr
- **청약홈**: https://www.applyhome.co.kr
- **학교알리미**: https://www.schoolinfo.go.kr
- **세움터**: https://www.eais.go.kr
