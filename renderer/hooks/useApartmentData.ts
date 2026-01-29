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

/**
 * 거래금액을 숫자로 변환 (문자열/숫자 모두 처리)
 */
function parseTradePrice(price: string | number): number {
  if (typeof price === 'number') {
    return price;
  }
  if (typeof price === 'string') {
    return parseInt(price.replace(/,/g, ''), 10) || 0;
  }
  return 0;
}

// 통계 계산 유틸 (any 타입으로 다양한 데이터 형식 지원)
export function calculateTradeStats(data: any[]) {
  if (!data || data.length === 0) {
    return {
      count: 0,
      avgPrice: 0,
      maxPrice: 0,
      minPrice: 0,
      avgPricePerPyeong: 0,
    };
  }

  const prices = data.map((item) => {
    // 새 API 형식 (거래금액: number) 또는 기존 형식 (거래금액: string) 모두 처리
    const price = item.거래금액 ?? item.dealAmount ?? 0;
    return parseTradePrice(price);
  });

  const pricesPerPyeong = data.map((item) => {
    const price = parseTradePrice(item.거래금액 ?? item.dealAmount ?? 0);
    const area = item.전용면적 ?? item.excluUseAr ?? 0;
    const pyeong = area / 3.3058;
    return pyeong > 0 ? price / pyeong : 0;
  });

  const validPrices = prices.filter((p) => p > 0);
  const validPricesPerPyeong = pricesPerPyeong.filter((p) => p > 0);

  return {
    count: data.length,
    avgPrice: validPrices.length > 0
      ? Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length)
      : 0,
    maxPrice: validPrices.length > 0 ? Math.max(...validPrices) : 0,
    minPrice: validPrices.length > 0 ? Math.min(...validPrices) : 0,
    avgPricePerPyeong: validPricesPerPyeong.length > 0
      ? Math.round(validPricesPerPyeong.reduce((a, b) => a + b, 0) / validPricesPerPyeong.length)
      : 0,
  };
}
