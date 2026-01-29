# ONSIA RTPS 개발 로그

## 프로젝트 개요
- **목표**: REPS (부동산R114) 클론 프로그램
- **기술 스택**: Nextron (Next.js + Electron), TypeScript, Tailwind CSS
- **패키지 매니저**: pnpm

## 완료된 작업

### 1. 프로젝트 초기화
```bash
npx create-nextron-app reps-clone --example with-tailwindcss
cd reps-clone
pnpm install
```

### 2. 설치된 라이브러리
```bash
pnpm install @tanstack/react-query zustand recharts axios
pnpm install @supabase/supabase-js fast-xml-parser xlsx
pnpm install lucide-react clsx tailwind-merge react-kakao-maps-sdk
```

| 라이브러리 | 용도 |
|-----------|------|
| @tanstack/react-query | 서버 상태 관리, API 캐싱 |
| zustand | 클라이언트 상태 관리 |
| recharts | 차트 시각화 |
| axios | HTTP 클라이언트 |
| fast-xml-parser | 공공데이터 XML → JSON 변환 |
| xlsx | 엑셀 다운로드 |
| lucide-react | 아이콘 |
| clsx, tailwind-merge | CSS 클래스 유틸리티 |
| react-kakao-maps-sdk | 카카오맵 |

### 3. 프로젝트 구조
```
D:\claude\raps\reps-clone\
├── main/                          # Electron 메인 프로세스
│   ├── background.ts              # 메인 프로세스 (IPC 핸들러 포함)
│   ├── preload.ts                 # 프리로드 스크립트
│   └── helpers/
│
├── renderer/                      # Next.js (프론트엔드)
│   ├── pages/
│   │   ├── _app.tsx               # 앱 진입점 (QueryClient 설정)
│   │   ├── index.tsx              # 리다이렉트
│   │   ├── home.tsx               # 홈 대시보드
│   │   ├── settings.tsx           # 설정 페이지
│   │   ├── apartment/index.tsx    # 아파트 분석
│   │   ├── officetel/index.tsx    # 오피스텔 분석
│   │   ├── commercial/index.tsx   # 상가 분석
│   │   ├── subscription/index.tsx # 청약 정보
│   │   └── api/
│   │       └── apartment/
│   │           ├── trade.ts       # 실거래가 API
│   │           └── rent.ts        # 전월세 API
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.tsx        # 사이드바 네비게이션
│   │   │   └── MainLayout.tsx     # 메인 레이아웃
│   │   ├── RegionSelector/        # 지역 선택기
│   │   ├── Chart/                 # Recharts 차트
│   │   └── DataTable/             # 데이터 테이블 (엑셀 다운로드)
│   │
│   ├── hooks/
│   │   └── useApartmentData.ts    # 아파트 데이터 훅
│   │
│   ├── stores/
│   │   ├── regionStore.ts         # 지역 상태 (Zustand)
│   │   └── uiStore.ts             # UI 상태
│   │
│   ├── lib/
│   │   ├── publicApi.ts           # 공공데이터 API 클라이언트
│   │   ├── cn.ts                  # Tailwind 클래스 유틸
│   │   └── excel.ts               # 엑셀 다운로드 유틸
│   │
│   └── styles/
│       └── globals.css            # Tailwind CSS
│
├── tailwind.config.js             # ⚠️ 루트에 있어야 함!
├── postcss.config.js              # ⚠️ 루트에 있어야 함!
├── package.json
└── .env.local                     # API 키
```

### 4. 중요한 설정 이슈 (해결됨)

#### Tailwind CSS가 적용 안 되는 문제
**원인**: Nextron이 `next -p PORT renderer` 명령을 **프로젝트 루트에서** 실행하기 때문에, `tailwind.config.js`와 `postcss.config.js`가 루트에 있어야 함.

**해결**:
```
# 잘못된 위치 (renderer 폴더)
renderer/tailwind.config.js  ❌
renderer/postcss.config.js   ❌

# 올바른 위치 (프로젝트 루트)
tailwind.config.js  ✅
postcss.config.js   ✅
```

**tailwind.config.js** (루트):
```javascript
module.exports = {
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**postcss.config.js** (루트):
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 5. 환경 변수
**.env.local**:
```
PUBLIC_DATA_API_KEY=197e316c105abb2eca0a51b23a08ca4b3978089d8ef84e06b20a04c01735da00
NEXT_PUBLIC_KAKAO_MAP_API_KEY=
```

### 6. 실행 방법
```bash
cd D:\claude\raps\reps-clone
pnpm dev
```
- 개발 서버: http://localhost:5000
- Electron 앱이 자동으로 열림

## 구현된 기능

### 홈 페이지
- 사이드바 네비게이션
- 히어로 섹션 (그라데이션 배경)
- **TOP 10 대시보드** (부동산지인 스타일)
  - TOP 10 상승 지역 (변동률 표시)
  - TOP 10 인기 아파트 (가격/변동률)
  - TOP 10 거래량 (거래건수)
  - 자동 새로고침 (10분) + 수동 새로고침 버튼
- 4개 메뉴 카드 (아파트/오피스텔/상가/청약)
- 최근 조회 / 시스템 정보 카드

### 아파트 분석 페이지
- 지역 선택기 (시도 → 시군구)
- 기간 선택 (년/월)
- 실거래가 데이터 테이블
- 통계 카드 (거래건수, 평균가, 최고가, 최저가)
- 차트 뷰 (월별 평균 거래가)
- 엑셀 다운로드

### API Routes
- `/api/apartment/trade` - 아파트 실거래가 (국토부 API 연동)
- `/api/apartment/rent` - 아파트 전월세
- `/api/rankings/top10` - TOP 10 랭킹 데이터
- API 키 없으면 샘플 데이터 반환

### 전국 시군구 코드
- `renderer/data/regionCodes.ts` - 전국 17개 시도 + 모든 시군구 코드
- 경기도, 부산, 대구, 인천 등 모든 지역 시군구 선택 가능

## 경쟁사 분석

**참조 문서**: [COMPETITOR_ANALYSIS.md](./COMPETITOR_ANALYSIS.md)

### 경쟁사 현황
| 서비스 | 특징 | 포지션 |
|--------|------|--------|
| REPS (부동산R114) | 가장 오래된 유료 서비스, 전문가용 | 업계 표준 |
| 부동산지인 (aptgin.com) | REPS 간소화 버전, 무료 웹 서비스 | 대중화 |
| **ONSIA RTPS** | 두 서비스의 장점 결합, 무료 데스크톱 앱 | **목표** |

### 핵심 전략
```
"REPS의 전문성 + 부동산지인의 접근성 = ONSIA RTPS"
```

## 다음 작업 (TODO)

### Phase 2: 부동산지인 벤치마킹 (우선)
- [ ] TOP 10 대시보드 (지역/아파트/거래량 랭킹)
- [ ] 실시간 변동률 표시 (상승↑빨강, 하락↓파랑)
- [ ] 통합 검색 + 자동완성
- [ ] 최근 검색 히스토리

### Phase 3: 추가 API 연동
- [ ] 오피스텔 실거래가 API
- [ ] 상가 실거래가 API
- [ ] 청약홈 분양정보 API
- [ ] 시군구 코드 API (전국)

### Phase 4: 기능 확장
- [ ] 카카오맵 컴포넌트 구현
- [ ] 차트 다양화 (면적별, 층별 분석)
- [ ] 즐겨찾기 기능
- [ ] 검색 히스토리

### Phase 5: 빌드 & 배포
- [ ] Electron 프로덕션 빌드
- [ ] Windows 설치 패키지 (.exe)
- [ ] 자동 업데이트 기능

## 공공데이터 API 정보

| API | 엔드포인트 | 용도 |
|-----|-----------|------|
| 국토부 아파트 실거래가 | `/getRTMSDataSvcAptTradeDev` | 매매 |
| 국토부 아파트 전월세 | `/getRTMSDataSvcAptRent` | 전월세 |
| 청약홈 분양정보 | `/getAPTLttotPblancList` | 분양 |
| 한국부동산원 | `/getHPIData` | 주택가격지수 |

## 트러블슈팅

### 포트 충돌
```bash
# package.json에서 포트 변경
"dev": "nextron --renderer-port 5000"
```

### Tailwind 클래스 미적용
1. 루트에 `tailwind.config.js`, `postcss.config.js` 확인
2. content 경로가 `./renderer/...`로 시작하는지 확인
3. `.next` 캐시 삭제 후 재시작

### pnpm 전환
```bash
rm -rf node_modules package-lock.json
pnpm install
```

---
*마지막 업데이트: 2026-01-30*
