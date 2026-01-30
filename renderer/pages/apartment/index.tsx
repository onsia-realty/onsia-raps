import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Printer,
  RefreshCw,
  Home,
  ChevronRight,
  List,
  Grid,
  Building2,
  Map as MapIcon,
} from 'lucide-react';
import { MainLayout } from '../../components/Layout';
import { RegionSelector } from '../../components/RegionSelector';
import { PriceChart } from '../../components/Chart';
import { DataTable } from '../../components/DataTable';
import {
  RegionStatsTable,
  RegionStats,
  QuadrantChart,
  QuadrantDataPoint,
  AnalysisFilters,
  FilterState,
  ComplexStatsTable,
  ComplexStats,
} from '../../components/Analysis';
import { MapView, MapModal } from '../../components/Map';
import { useRegionStore } from '../../stores/regionStore';
import { useUIStore } from '../../stores/uiStore';
import { useApartmentTrade, calculateTradeStats } from '../../hooks/useApartmentData';
import { formatPrice, formatArea } from '../../lib/publicApi';
import { aggregateByComplex, getSampleComplexStats } from '../../lib/aggregateByComplex';
import { cn } from '../../lib/cn';

type ViewMode = 'overview' | 'complex' | 'table' | 'chart' | 'map';

// 샘플 지역 통계 데이터
const sampleRegionStats: RegionStats[] = [
  {
    id: '1',
    name: '잠실동',
    population: 104881,
    households: 42864,
    avgTradePrice: 101980,
    avgJeonsePrice: 32120,
    jeonseRatio: 32,
    totalComplexes: 861,
    totalUnits: 37821,
    aptComplexes: 19,
    aptUnits: 27863,
    officetelComplexes: 18,
    officetelUnits: 1878,
    priceChange: 2.5,
    changeType: 'up',
  },
  {
    id: '2',
    name: '신천동',
    population: 37217,
    households: 13020,
    avgTradePrice: 90070,
    avgJeonsePrice: 28220,
    jeonseRatio: 31,
    totalComplexes: 16,
    totalUnits: 17237,
    aptComplexes: 14,
    aptUnits: 16992,
    officetelComplexes: 2,
    officetelUnits: 245,
    priceChange: 1.8,
    changeType: 'up',
  },
  {
    id: '3',
    name: '풍납동',
    population: 33751,
    households: 15623,
    avgTradePrice: 48460,
    avgJeonsePrice: 22800,
    jeonseRatio: 47,
    totalComplexes: 266,
    totalUnits: 9412,
    aptComplexes: 29,
    aptUnits: 7189,
    officetelComplexes: 0,
    officetelUnits: 0,
    priceChange: -0.5,
    changeType: 'down',
  },
  {
    id: '4',
    name: '송파동',
    population: 42188,
    households: 20036,
    avgTradePrice: 64870,
    avgJeonsePrice: 21970,
    jeonseRatio: 34,
    totalComplexes: 1000,
    totalUnits: 16286,
    aptComplexes: 38,
    aptUnits: 6519,
    officetelComplexes: 6,
    officetelUnits: 160,
    priceChange: 0,
    changeType: 'same',
  },
  {
    id: '5',
    name: '가락동',
    population: 58234,
    households: 24567,
    avgTradePrice: 89500,
    avgJeonsePrice: 35200,
    jeonseRatio: 39,
    totalComplexes: 450,
    totalUnits: 28000,
    aptComplexes: 42,
    aptUnits: 25000,
    officetelComplexes: 8,
    officetelUnits: 2500,
    priceChange: 3.2,
    changeType: 'up',
  },
  {
    id: '6',
    name: '문정동',
    population: 28543,
    households: 12340,
    avgTradePrice: 72300,
    avgJeonsePrice: 28900,
    jeonseRatio: 40,
    totalComplexes: 180,
    totalUnits: 15600,
    aptComplexes: 22,
    aptUnits: 12400,
    officetelComplexes: 15,
    officetelUnits: 3200,
    priceChange: 1.2,
    changeType: 'up',
  },
];

// 4분면 차트용 데이터 변환
const convertToQuadrantData = (stats: RegionStats[]): QuadrantDataPoint[] => {
  return stats.map((s) => ({
    id: s.id,
    name: s.name,
    tradePrice: s.avgTradePrice / 10000,
    jeonsePrice: s.avgJeonsePrice / 10000,
    jeonseRatio: s.jeonseRatio,
    priceChange: s.priceChange,
    changeType: s.changeType,
    size: Math.max(6, Math.min(15, s.aptUnits / 3000)),
  }));
};

export default function ApartmentPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedComplex, setSelectedComplex] = useState<ComplexStats | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    region: '',
    period: '202601',
    priceFilter: 'all',
    complexFilter: 'all',
    changeType: 'all',
    priceUnit: 'total',
    hasPrice: 'all',
  });

  const { selectedSido, selectedGugun, startYear, startMonth } = useRegionStore();
  const { showNotification } = useUIStore();

  // 실거래가 데이터 조회
  const { data: tradeData, isLoading, error, refetch } = useApartmentTrade(
    selectedGugun?.code || null,
    startYear,
    startMonth,
    searchEnabled
  );

  const regionLabel = useMemo(() => {
    if (selectedSido && selectedGugun) {
      return `${selectedSido.name} ${selectedGugun.name}`;
    }
    return '지역을 선택하세요';
  }, [selectedSido, selectedGugun]);

  const handleSearch = () => {
    if (!selectedGugun) {
      showNotification('warning', '시/군/구를 선택해주세요.');
      return;
    }
    setSearchEnabled(true);
    refetch();
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === sampleRegionStats.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sampleRegionStats.map((s) => s.id));
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      region: '',
      period: '202601',
      priceFilter: 'all',
      complexFilter: 'all',
      changeType: 'all',
      priceUnit: 'total',
      hasPrice: 'all',
    });
  };

  const handleFavoriteClick = (complex: ComplexStats) => {
    setFavorites((prev) =>
      prev.includes(complex.id)
        ? prev.filter((id) => id !== complex.id)
        : [...prev, complex.id]
    );
  };

  const handleMapClick = (complex: ComplexStats) => {
    setSelectedComplex(complex);
    setMapModalOpen(true);
  };

  // 통계 계산
  const stats = tradeData?.data ? calculateTradeStats(tradeData.data) : null;

  // 단지별 통계 계산
  const complexStats = useMemo(() => {
    if (!tradeData?.data || tradeData.data.length === 0) {
      // 샘플 데이터 반환
      return getSampleComplexStats();
    }
    return aggregateByComplex(tradeData.data);
  }, [tradeData]);

  // 차트 데이터 변환
  const chartData = useMemo(() => {
    if (!tradeData?.data) return [];
    const monthlyData: Record<string, { total: number; count: number }> = {};
    tradeData.data.forEach((item: any) => {
      const year = item.년 || item.거래일?.split('-')[0];
      const month = item.월 || item.거래일?.split('-')[1];
      const key = `${year}.${month}`;
      const price = typeof item.거래금액 === 'string'
        ? parseInt(item.거래금액.replace(/,/g, ''), 10)
        : item.거래금액;
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

  const quadrantData = useMemo(() => {
    return convertToQuadrantData(sampleRegionStats);
  }, []);

  // 테이블 컬럼 정의
  const columns = [
    { key: '아파트', header: '아파트명', width: 180 },
    { key: '법정동', header: '법정동', width: 100 },
    {
      key: '거래금액표시',
      header: '거래금액',
      width: 120,
      render: (value: string, row: any) => (
        <span className="font-medium text-blue-600">
          {value || formatPrice(row.거래금액)}
        </span>
      ),
    },
    {
      key: '전용면적',
      header: '전용면적',
      width: 100,
      render: (value: number) => `${value}㎡`,
    },
    {
      key: '평수',
      header: '평',
      width: 60,
      render: (value: number) => `${value}평`,
    },
    { key: '층', header: '층', width: 50, render: (value: number) => `${value}층` },
    { key: '건축년도', header: '건축년도', width: 80 },
    { key: '거래일', header: '거래일', width: 100 },
    { key: '거래유형', header: '거래유형', width: 80 },
  ];

  return (
    <MainLayout>
      <Head>
        <title>아파트 분석 - ONSIA RTPS</title>
      </Head>

      {/* 브레드크럼 */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <Home size={14} />
        <ChevronRight size={14} />
        <span>아파트</span>
        <ChevronRight size={14} />
        <span className="font-medium text-slate-800">{regionLabel}</span>
      </div>

      {/* 지역 선택기 */}
      <RegionSelector onSearch={handleSearch} className="mb-4" />

      {/* 필터 바 (부동산지인 스타일) */}
      <AnalysisFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
        className="mb-6"
      />

      {/* 뷰 모드 토글 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            )}
          >
            <Grid size={16} />
            지역 현황
          </button>
          <button
            onClick={() => setViewMode('complex')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'complex'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            )}
          >
            <Building2 size={16} />
            단지별 시세
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            )}
          >
            <List size={16} />
            실거래 목록
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
            <BarChart3 size={16} />
            차트
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            )}
          >
            <MapIcon size={16} />
            지도
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
            <Printer size={14} />
            인쇄
          </button>
          <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
            <Download size={14} />
            엑셀
          </button>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            새로고침
          </button>
        </div>
      </div>

      {/* 지역 현황 뷰 (부동산지인 스타일) */}
      {viewMode === 'overview' && (
        <>
          {/* 지역 통계 테이블 */}
          <div className="mb-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <span className="text-blue-600">📍</span>
              필터가 적용된 읍/면/동 현황
            </h2>
            <RegionStatsTable
              data={sampleRegionStats}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onRowClick={(region) => console.log('선택:', region.name)}
            />
          </div>

          {/* 4분면 차트 */}
          <div className="mb-6">
            <QuadrantChart
              data={quadrantData}
              title={`${startYear}-${String(startMonth).padStart(2, '0')} 4분면 현황`}
              onPointClick={(point) => console.log('차트 선택:', point.name)}
            />
          </div>
        </>
      )}

      {/* 단지별 시세 뷰 */}
      {viewMode === 'complex' && (
        <>
          {/* 단지별 통계 테이블 */}
          <div className="mb-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Building2 size={20} className="text-blue-600" />
              단지별 시세 현황
              {searchEnabled && tradeData?.data && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({selectedGugun?.name} {startYear}년 {startMonth}월 기준)
                </span>
              )}
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">데이터를 불러오는 중...</div>
              </div>
            ) : (
              <ComplexStatsTable
                data={complexStats}
                favorites={favorites}
                onRowClick={(complex) => {
                  showNotification('info', `${complex.name} 상세 정보 (준비중)`);
                }}
                onMapClick={handleMapClick}
                onFavoriteClick={handleFavoriteClick}
              />
            )}
          </div>

          {/* 4분면 차트 */}
          <div className="mb-6">
            <QuadrantChart
              data={quadrantData}
              title={`${startYear}-${String(startMonth).padStart(2, '0')} 4분면 현황`}
              onPointClick={(point) => console.log('차트 선택:', point.name)}
            />
          </div>
        </>
      )}

      {/* 실거래 목록 뷰 */}
      {viewMode === 'table' && (
        <>
          {/* 통계 카드 */}
          {stats && (
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-sm text-slate-500">거래 건수</div>
                <div className="mt-1 text-2xl font-bold text-slate-800">
                  {stats.count.toLocaleString()}건
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-sm text-slate-500">평균 거래가</div>
                <div className="mt-1 text-2xl font-bold text-blue-600">
                  {formatPrice(stats.avgPrice)}
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <TrendingUp size={14} className="text-red-500" />
                  최고가
                </div>
                <div className="mt-1 text-2xl font-bold text-red-600">
                  {formatPrice(stats.maxPrice)}
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <TrendingDown size={14} className="text-green-500" />
                  최저가
                </div>
                <div className="mt-1 text-2xl font-bold text-green-600">
                  {formatPrice(stats.minPrice)}
                </div>
              </div>
            </div>
          )}

          {/* 로딩 */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-500">데이터를 불러오는 중...</div>
            </div>
          )}

          {/* 에러 */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          )}

          {/* 데이터 테이블 */}
          {tradeData?.data && tradeData.data.length > 0 && (
            <DataTable
              data={tradeData.data}
              columns={columns}
              title={`아파트 실거래가 (${selectedGugun?.name || ''})`}
              exportFileName={`아파트실거래가_${selectedGugun?.name}_${startYear}${startMonth}`}
            />
          )}

          {/* 데이터 없음 */}
          {searchEnabled && tradeData?.data?.length === 0 && (
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
        </>
      )}

      {/* 차트 뷰 */}
      {viewMode === 'chart' && (
        <>
          {chartData.length > 0 ? (
            <PriceChart
              data={chartData}
              title="월별 평균 거래가 추이"
              dataKeys={[{ key: '평균가격', name: '평균 거래가', color: '#2563eb' }]}
              yAxisLabel="만원"
            />
          ) : (
            <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500">
              차트를 표시하려면 지역을 선택하고 검색하세요.
            </div>
          )}
        </>
      )}

      {/* 지도 뷰 */}
      {viewMode === 'map' && (
        <MapView
          complexes={complexStats.map((c) => ({
            id: c.id,
            name: c.name,
            dong: c.dong,
            tradePrice: c.tradePrice,
            tradePriceText: `${Math.floor(c.tradePrice / 10000)}억 ${(c.tradePrice % 10000).toLocaleString()}`,
          }))}
          regionName={regionLabel}
          onComplexSelect={(complex) => {
            const found = complexStats.find((c) => c.id === complex.id);
            if (found) {
              setSelectedComplex(found);
            }
          }}
        />
      )}

      {/* 단지 지도 모달 */}
      <MapModal
        isOpen={mapModalOpen}
        onClose={() => {
          setMapModalOpen(false);
          setSelectedComplex(null);
        }}
        title={selectedComplex ? `${selectedComplex.name} 위치` : '아파트 위치'}
        markers={
          selectedComplex
            ? [
                {
                  id: selectedComplex.id,
                  name: selectedComplex.name,
                  lat: selectedComplex.lat || 37.5172 + (Math.random() - 0.5) * 0.01,
                  lng: selectedComplex.lng || 127.0473 + (Math.random() - 0.5) * 0.01,
                  price: selectedComplex.tradePrice,
                  priceText: `${Math.floor(selectedComplex.tradePrice / 10000)}억`,
                  dong: selectedComplex.dong,
                  info: `${selectedComplex.avgPyeong}평 / ${selectedComplex.buildYear}년 / ${selectedComplex.tradeCount}건`,
                },
              ]
            : []
        }
        selectedMarkerId={selectedComplex?.id}
      />
    </MainLayout>
  );
}
