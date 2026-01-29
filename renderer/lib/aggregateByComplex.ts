import { ComplexStats } from '../components/Analysis/ComplexStatsTable';

interface TradeItem {
  id?: string;
  아파트: string;
  법정동: string;
  지번?: string | number;
  전용면적: number;
  평수?: number;
  층: number;
  건축년도: number;
  거래금액: number | string;
  거래금액표시?: string;
  // 새 API 형식
  거래일?: string;
  // 기존 API 형식
  년?: number;
  월?: number;
  일?: number;
  거래유형?: string;
  해제여부?: boolean | string;
}

interface RentItem {
  아파트: string;
  법정동: string;
  전용면적: number;
  보증금액: string | number;
  월세금액?: string | number;
  건축년도: number;
  층: number;
}

/**
 * 거래 데이터를 단지별로 집계하여 ComplexStats 배열로 변환
 */
export function aggregateByComplex(
  tradeData: TradeItem[],
  rentData?: RentItem[],
  previousTradeData?: TradeItem[]
): ComplexStats[] {
  // 1. 매매 데이터를 단지별로 그룹화
  const complexMap = new Map<string, {
    trades: TradeItem[];
    rents: RentItem[];
    prevTrades: TradeItem[];
  }>();

  // 현재 매매 데이터 그룹화
  tradeData.forEach((trade) => {
    // 해제된 거래 제외 (boolean 또는 'O' 문자열 모두 처리)
    if (trade.해제여부 === true || trade.해제여부 === 'O') return;

    const key = `${trade.아파트}_${trade.법정동}`;
    if (!complexMap.has(key)) {
      complexMap.set(key, { trades: [], rents: [], prevTrades: [] });
    }
    complexMap.get(key)!.trades.push(trade);
  });

  // 전세 데이터 그룹화
  if (rentData) {
    rentData.forEach((rent) => {
      const key = `${rent.아파트}_${rent.법정동}`;
      if (!complexMap.has(key)) {
        complexMap.set(key, { trades: [], rents: [], prevTrades: [] });
      }
      complexMap.get(key)!.rents.push(rent);
    });
  }

  // 이전 매매 데이터 그룹화 (증감 계산용)
  if (previousTradeData) {
    previousTradeData.forEach((trade) => {
      if (trade.해제여부 === true || trade.해제여부 === 'O') return;
      const key = `${trade.아파트}_${trade.법정동}`;
      if (complexMap.has(key)) {
        complexMap.get(key)!.prevTrades.push(trade);
      }
    });
  }

  // 2. 단지별 통계 계산
  const results: ComplexStats[] = [];

  complexMap.forEach((data, key) => {
    const { trades, rents, prevTrades } = data;

    // 매매 데이터가 없으면 스킵
    if (trades.length === 0) return;

    // 기본 정보 (첫 번째 거래 기준)
    const firstTrade = trades[0];
    const name = firstTrade.아파트;
    const dong = firstTrade.법정동;
    const buildYear = firstTrade.건축년도;

    // 매매 통계 (거래금액이 문자열인 경우 숫자로 변환)
    const tradePrices = trades.map((t) => {
      const price = t.거래금액;
      if (typeof price === 'string') {
        return parseInt(price.replace(/,/g, ''), 10) || 0;
      }
      return price || 0;
    });
    const avgTradePrice = Math.round(
      tradePrices.reduce((a, b) => a + b, 0) / tradePrices.length
    );

    // 면적 통계
    const areas = trades.map((t) => t.전용면적);
    const avgArea = areas.reduce((a, b) => a + b, 0) / areas.length;
    const avgPyeong = avgArea / 3.3058;

    // 평당 매매가
    const tradePricePerPyeong = Math.round(avgTradePrice / avgPyeong);

    // 세대수 추정 (거래 건수 기반, 실제로는 별도 데이터 필요)
    const uniqueFloors = new Set(trades.map((t) => t.층));
    const estimatedUnits = Math.max(trades.length * 10, uniqueFloors.size * 4);

    // 전세 통계
    let jeonsePrice: number | undefined;
    let jeonsePricePerPyeong: number | undefined;
    let jeonseRate: number | undefined;

    if (rents.length > 0) {
      const jeonsePrices = rents.map((r) => {
        const price = typeof r.보증금액 === 'string'
          ? parseInt(r.보증금액.replace(/,/g, ''), 10)
          : r.보증금액;
        return price || 0;
      }).filter((p) => p > 0);

      if (jeonsePrices.length > 0) {
        jeonsePrice = Math.round(
          jeonsePrices.reduce((a, b) => a + b, 0) / jeonsePrices.length
        );
        jeonsePricePerPyeong = Math.round(jeonsePrice / avgPyeong);
        jeonseRate = Math.round((jeonsePrice / avgTradePrice) * 100);
      }
    }

    // 가격 변동 계산
    let priceChange = 0;
    let priceChangePercent = 0;
    let changeType: 'up' | 'down' | 'same' = 'same';

    if (prevTrades.length > 0) {
      const prevPrices = prevTrades.map((t) => {
        const price = t.거래금액;
        if (typeof price === 'string') {
          return parseInt(price.replace(/,/g, ''), 10) || 0;
        }
        return price || 0;
      });
      const avgPrevPrice = prevPrices.reduce((a, b) => a + b, 0) / prevPrices.length;

      priceChange = Math.round(avgTradePrice - avgPrevPrice);
      priceChangePercent = avgPrevPrice > 0
        ? Math.round((priceChange / avgPrevPrice) * 100 * 10) / 10
        : 0;

      if (priceChange > 0) changeType = 'up';
      else if (priceChange < 0) changeType = 'down';
    }

    results.push({
      id: key,
      name,
      dong,
      totalUnits: estimatedUnits,
      buildYear,
      avgArea,
      avgPyeong: Math.round(avgPyeong * 10) / 10,
      tradePrice: avgTradePrice,
      tradePricePerPyeong,
      tradeCount: trades.length,
      jeonsePrice,
      jeonsePricePerPyeong,
      jeonseRate,
      priceChange,
      priceChangePercent,
      changeType,
    });
  });

  // 3. 매매가 기준 내림차순 정렬
  results.sort((a, b) => b.tradePrice - a.tradePrice);

  return results;
}

/**
 * 샘플 단지 데이터 생성 (개발/테스트용)
 */
export function getSampleComplexStats(): ComplexStats[] {
  return [
    {
      id: '1',
      name: '올림픽선수기자촌',
      dong: '잠실동',
      totalUnits: 5539,
      buildYear: 1988,
      avgArea: 134.5,
      avgPyeong: 40.7,
      tradePrice: 509653,
      tradePricePerPyeong: 12523,
      tradeCount: 15,
      jeonsePrice: 142283,
      jeonsePricePerPyeong: 3495,
      jeonseRate: 28,
      priceChange: 5509,
      priceChangePercent: 1.1,
      changeType: 'up',
    },
    {
      id: '2',
      name: '잠실엘스',
      dong: '잠실동',
      totalUnits: 5678,
      buildYear: 2008,
      avgArea: 84.9,
      avgPyeong: 25.7,
      tradePrice: 422252,
      tradePricePerPyeong: 16432,
      tradeCount: 23,
      jeonsePrice: 134159,
      jeonsePricePerPyeong: 5220,
      jeonseRate: 32,
      priceChange: -7434,
      priceChangePercent: -1.7,
      changeType: 'down',
    },
    {
      id: '3',
      name: '리센츠',
      dong: '잠실동',
      totalUnits: 5563,
      buildYear: 2008,
      avgArea: 84.9,
      avgPyeong: 25.7,
      tradePrice: 418769,
      tradePricePerPyeong: 16296,
      tradeCount: 18,
      jeonsePrice: 123213,
      jeonsePricePerPyeong: 4795,
      jeonseRate: 29,
      priceChange: 2467,
      priceChangePercent: 0.6,
      changeType: 'up',
    },
    {
      id: '4',
      name: '트리지움',
      dong: '잠실동',
      totalUnits: 3696,
      buildYear: 2008,
      avgArea: 84.9,
      avgPyeong: 25.7,
      tradePrice: 415971,
      tradePricePerPyeong: 16187,
      tradeCount: 12,
      jeonsePrice: 122290,
      jeonsePricePerPyeong: 4759,
      jeonseRate: 29,
      priceChange: 2450,
      priceChangePercent: 0.6,
      changeType: 'up',
    },
    {
      id: '5',
      name: '파크리오',
      dong: '잠실동',
      totalUnits: 6864,
      buildYear: 2008,
      avgArea: 84.9,
      avgPyeong: 25.7,
      tradePrice: 401852,
      tradePricePerPyeong: 15637,
      tradeCount: 21,
      jeonsePrice: 111106,
      jeonsePricePerPyeong: 4323,
      jeonseRate: 28,
      priceChange: 625,
      priceChangePercent: 0.2,
      changeType: 'up',
    },
    {
      id: '6',
      name: '레이크팰리스',
      dong: '잠실동',
      totalUnits: 2678,
      buildYear: 2006,
      avgArea: 119.5,
      avgPyeong: 36.1,
      tradePrice: 379577,
      tradePricePerPyeong: 10514,
      tradeCount: 8,
      jeonsePrice: 125524,
      jeonsePricePerPyeong: 3477,
      jeonseRate: 33,
      priceChange: 112,
      priceChangePercent: 0,
      changeType: 'same',
    },
    {
      id: '7',
      name: '잠실주공5단지',
      dong: '잠실동',
      totalUnits: 3930,
      buildYear: 1978,
      avgArea: 76.4,
      avgPyeong: 23.1,
      tradePrice: 376834,
      tradePricePerPyeong: 16313,
      tradeCount: 14,
      jeonsePrice: 124617,
      jeonsePricePerPyeong: 5395,
      jeonseRate: 33,
      priceChange: 111,
      priceChangePercent: 0,
      changeType: 'same',
    },
    {
      id: '8',
      name: '장미1차',
      dong: '잠실동',
      totalUnits: 2640,
      buildYear: 1979,
      avgArea: 84.9,
      avgPyeong: 25.7,
      tradePrice: 373746,
      tradePricePerPyeong: 14543,
      tradeCount: 9,
      jeonsePrice: 117230,
      jeonsePricePerPyeong: 4562,
      jeonseRate: 31,
      priceChange: -1008,
      priceChangePercent: -0.3,
      changeType: 'down',
    },
  ];
}
