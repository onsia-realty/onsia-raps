import React, { useState } from 'react';
import Head from 'next/head';
import { TrendingUp, TrendingDown, BarChart3, Download } from 'lucide-react';
import { MainLayout } from '../../components/Layout';
import { RegionSelector } from '../../components/RegionSelector';
import { PriceChart } from '../../components/Chart';
import { DataTable } from '../../components/DataTable';
import { useRegionStore } from '../../stores/regionStore';
import { useUIStore } from '../../stores/uiStore';
import { useApartmentTrade, calculateTradeStats } from '../../hooks/useApartmentData';
import { formatPrice, formatArea, ApartmentTradeItem } from '../../lib/publicApi';
import { cn } from '../../lib/cn';

type ViewMode = 'chart' | 'table';

export default function ApartmentPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchEnabled, setSearchEnabled] = useState(false);

  const { selectedGugun, startYear, startMonth } = useRegionStore();
  const { setLoading, showNotification } = useUIStore();

  // 실거래가 데이터 조회
  const { data: tradeData, isLoading, error, refetch } = useApartmentTrade(
    selectedGugun?.code || null,
    startYear,
    startMonth,
    searchEnabled
  );

  const handleSearch = () => {
    if (!selectedGugun) {
      showNotification('warning', '시/군/구를 선택해주세요.');
      return;
    }
    setSearchEnabled(true);
    refetch();
  };

  // 통계 계산
  const stats = tradeData?.data ? calculateTradeStats(tradeData.data) : null;

  // 차트 데이터 변환
  const chartData = React.useMemo(() => {
    if (!tradeData?.data) return [];

    // 월별 평균 가격 집계
    const monthlyData: Record<string, { total: number; count: number }> = {};

    tradeData.data.forEach((item) => {
      const key = `${item.년}.${item.월}`;
      const price = parseInt(item.거래금액.replace(/,/g, ''), 10);

      if (!monthlyData[key]) {
        monthlyData[key] = { total: 0, count: 0 };
      }
      monthlyData[key].total += price;
      monthlyData[key].count += 1;
    });

    return Object.entries(monthlyData)
      .map(([key, value]) => ({
        name: key,
        평균가격: Math.round(value.total / value.count),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tradeData]);

  // 테이블 컬럼 정의
  const columns = [
    {
      key: '아파트',
      header: '아파트명',
      width: 180,
    },
    {
      key: '법정동',
      header: '법정동',
      width: 100,
    },
    {
      key: '거래금액',
      header: '거래금액',
      width: 120,
      render: (value: string) => (
        <span className="font-medium text-blue-600">{formatPrice(value)}</span>
      ),
    },
    {
      key: '전용면적',
      header: '전용면적',
      width: 140,
      render: (value: number) => formatArea(value),
    },
    {
      key: '층',
      header: '층',
      width: 60,
      render: (value: number) => `${value}층`,
    },
    {
      key: '건축년도',
      header: '건축년도',
      width: 80,
    },
    {
      key: '거래일',
      header: '거래일',
      width: 100,
      render: (_: any, row: ApartmentTradeItem) => `${row.년}.${row.월}.${row.일}`,
    },
  ];

  return (
    <MainLayout title="아파트 분석">
      <Head>
        <title>아파트 분석 - REPS Clone</title>
      </Head>

      {/* 검색 조건 */}
      <RegionSelector onSearch={handleSearch} className="mb-6" />

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">데이터를 불러오는 중...</div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      )}

      {/* 데이터 표시 */}
      {tradeData?.data && tradeData.data.length > 0 && (
        <>
          {/* 통계 카드 */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">거래 건수</div>
              <div className="mt-1 text-2xl font-bold text-slate-800">
                {stats?.count.toLocaleString()}건
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">평균 거래가</div>
              <div className="mt-1 text-2xl font-bold text-blue-600">
                {stats ? formatPrice(stats.avgPrice) : '-'}
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <TrendingUp size={14} className="text-red-500" />
                최고가
              </div>
              <div className="mt-1 text-2xl font-bold text-red-600">
                {stats ? formatPrice(stats.maxPrice) : '-'}
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <TrendingDown size={14} className="text-green-500" />
                최저가
              </div>
              <div className="mt-1 text-2xl font-bold text-green-600">
                {stats ? formatPrice(stats.minPrice) : '-'}
              </div>
            </div>
          </div>

          {/* 뷰 모드 토글 */}
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              )}
            >
              <BarChart3 size={16} />
              테이블
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                viewMode === 'chart'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              )}
            >
              <TrendingUp size={16} />
              차트
            </button>
          </div>

          {/* 데이터 뷰 */}
          {viewMode === 'table' ? (
            <DataTable
              data={tradeData.data}
              columns={columns}
              title={`아파트 실거래가 (${selectedGugun?.name || ''})`}
              exportFileName={`아파트실거래가_${selectedGugun?.name}_${startYear}${startMonth}`}
            />
          ) : (
            <PriceChart
              data={chartData}
              title="월별 평균 거래가 추이"
              dataKeys={[{ key: '평균가격', name: '평균 거래가', color: '#2563eb' }]}
              yAxisLabel="만원"
            />
          )}
        </>
      )}

      {/* 데이터 없음 */}
      {tradeData?.data && tradeData.data.length === 0 && (
        <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500">
          해당 조건에 맞는 거래 데이터가 없습니다.
        </div>
      )}

      {/* 검색 전 안내 */}
      {!searchEnabled && !isLoading && (
        <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500">
          지역과 기간을 선택한 후 검색 버튼을 클릭하세요.
        </div>
      )}
    </MainLayout>
  );
}
