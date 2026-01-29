import { useQuery } from '@tanstack/react-query';
import { fetchFromApi, ApartmentTradeItem, ApartmentRentItem, formatYearMonth } from '../lib/publicApi';

interface TradeApiResponse {
  success: boolean;
  data?: ApartmentTradeItem[];
  totalCount?: number;
  error?: string;
}

interface RentApiResponse {
  success: boolean;
  data?: ApartmentRentItem[];
  totalCount?: number;
  error?: string;
}

// 아파트 실거래가 조회 훅
export function useApartmentTrade(
  regionCode: string | null,
  year: number,
  month: number,
  enabled: boolean = true
) {
  return useQuery<TradeApiResponse>({
    queryKey: ['apartmentTrade', regionCode, year, month],
    queryFn: () =>
      fetchFromApi<TradeApiResponse>('/api/apartment/trade', {
        lawd_cd: regionCode!,
        deal_ymd: formatYearMonth(year, month),
      }),
    enabled: enabled && !!regionCode,
    staleTime: 5 * 60 * 1000, // 5분 캐시
    retry: 2,
  });
}

// 아파트 전월세 조회 훅
export function useApartmentRent(
  regionCode: string | null,
  year: number,
  month: number,
  enabled: boolean = true
) {
  return useQuery<RentApiResponse>({
    queryKey: ['apartmentRent', regionCode, year, month],
    queryFn: () =>
      fetchFromApi<RentApiResponse>('/api/apartment/rent', {
        lawd_cd: regionCode!,
        deal_ymd: formatYearMonth(year, month),
      }),
    enabled: enabled && !!regionCode,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// 기간별 아파트 실거래가 조회 (다중 월 조회)
export function useApartmentTradeRange(
  regionCode: string | null,
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number,
  enabled: boolean = true
) {
  // 기간 내 모든 월 생성
  const months: { year: number; month: number }[] = [];
  let currentYear = startYear;
  let currentMonth = startMonth;

  while (
    currentYear < endYear ||
    (currentYear === endYear && currentMonth <= endMonth)
  ) {
    months.push({ year: currentYear, month: currentMonth });
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  // 각 월별 쿼리 결과를 합치기 위한 단일 쿼리
  return useQuery<ApartmentTradeItem[]>({
    queryKey: ['apartmentTradeRange', regionCode, startYear, startMonth, endYear, endMonth],
    queryFn: async () => {
      const results = await Promise.all(
        months.map(({ year, month }) =>
          fetchFromApi<TradeApiResponse>('/api/apartment/trade', {
            lawd_cd: regionCode!,
            deal_ymd: formatYearMonth(year, month),
          })
        )
      );

      return results.flatMap((r) => r.data || []);
    },
    enabled: enabled && !!regionCode,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// 통계 계산 유틸
export function calculateTradeStats(data: ApartmentTradeItem[]) {
  if (data.length === 0) {
    return {
      count: 0,
      avgPrice: 0,
      maxPrice: 0,
      minPrice: 0,
      avgPricePerPyeong: 0,
    };
  }

  const prices = data.map((item) =>
    parseInt(item.거래금액.replace(/,/g, ''), 10)
  );
  const pricesPerPyeong = data.map((item) => {
    const price = parseInt(item.거래금액.replace(/,/g, ''), 10);
    const pyeong = item.전용면적 / 3.3058;
    return price / pyeong;
  });

  return {
    count: data.length,
    avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    maxPrice: Math.max(...prices),
    minPrice: Math.min(...prices),
    avgPricePerPyeong: Math.round(
      pricesPerPyeong.reduce((a, b) => a + b, 0) / pricesPerPyeong.length
    ),
  };
}
