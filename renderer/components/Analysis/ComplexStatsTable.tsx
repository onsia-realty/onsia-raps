import React, { useState, useMemo } from 'react';
import { Star, MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface ComplexStats {
  id: string;
  name: string;           // 단지명
  dong: string;           // 법정동
  totalUnits: number;     // 세대수
  buildYear: number;      // 건축년도
  avgArea: number;        // 평균 전용면적
  avgPyeong: number;      // 평균 평수

  // 매매 정보
  tradePrice: number;     // 매매 시세 (만원)
  tradePricePerPyeong: number; // 평당 매매가
  tradeCount: number;     // 거래 건수

  // 전세 정보 (있는 경우)
  jeonsePrice?: number;   // 전세 시세
  jeonsePricePerPyeong?: number;
  jeonseRate?: number;    // 전세율 (%)

  // 변동 정보
  priceChange: number;    // 가격 변동 (만원)
  priceChangePercent: number; // 변동률 (%)
  changeType: 'up' | 'down' | 'same';

  // 위치 정보
  lat?: number;
  lng?: number;
}

interface ComplexStatsTableProps {
  data: ComplexStats[];
  onRowClick?: (complex: ComplexStats) => void;
  onMapClick?: (complex: ComplexStats) => void;
  onFavoriteClick?: (complex: ComplexStats) => void;
  favorites?: string[];
  className?: string;
}

// 금액 포맷팅 (억/만원)
function formatPrice(price: number): string {
  if (price >= 10000) {
    const eok = Math.floor(price / 10000);
    const man = price % 10000;
    if (man === 0) {
      return `${eok}억`;
    }
    return `${eok}억 ${man.toLocaleString()}`;
  }
  return `${price.toLocaleString()}`;
}

// 간략 금액 포맷팅
function formatPriceShort(price: number): string {
  if (price >= 10000) {
    const eok = (price / 10000).toFixed(1);
    return `${eok}억`;
  }
  return `${(price / 1000).toFixed(1)}천`;
}

export function ComplexStatsTable({
  data,
  onRowClick,
  onMapClick,
  onFavoriteClick,
  favorites = [],
  className,
}: ComplexStatsTableProps) {
  const [sortKey, setSortKey] = useState<keyof ComplexStats>('tradePrice');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const handleSort = (key: keyof ComplexStats) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortHeader = ({
    label,
    sortKeyName,
    className: headerClassName,
  }: {
    label: string;
    sortKeyName: keyof ComplexStats;
    className?: string;
  }) => (
    <th
      className={cn(
        'px-3 py-3 text-left text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors',
        headerClassName
      )}
      onClick={() => handleSort(sortKeyName)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === sortKeyName && (
          <span className="text-blue-600">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white overflow-hidden', className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">
            단지수 <span className="text-blue-600 font-bold">{data.length}</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-sm text-slate-500">
            총 세대수 <span className="font-medium text-slate-700">{data.reduce((sum, c) => sum + c.totalUnits, 0).toLocaleString()}</span>
          </span>
        </div>
        <div className="text-xs text-slate-400">
          (단위 : 공급면적, 만원)
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-10 px-3 py-3"></th>
              <SortHeader label="단지명" sortKeyName="name" />
              <SortHeader label="세대수" sortKeyName="totalUnits" className="text-right" />
              <SortHeader label="면적(평)" sortKeyName="avgPyeong" className="text-right" />
              <SortHeader label="건축" sortKeyName="buildYear" className="text-center" />
              <th className="px-3 py-3 text-center text-xs font-medium text-slate-600 bg-blue-50">
                매매시세
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-slate-600 bg-green-50">
                전세시세
              </th>
              <SortHeader label="증감" sortKeyName="priceChange" className="text-right" />
              <SortHeader label="전세율" sortKeyName="jeonseRate" className="text-center" />
              <th className="px-3 py-3 text-center text-xs font-medium text-slate-600">
                거래
              </th>
              <th className="w-10 px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.map((complex, index) => {
              const isFavorite = favorites.includes(complex.id);

              return (
                <tr
                  key={complex.id}
                  className={cn(
                    'hover:bg-blue-50/50 transition-colors',
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  )}
                >
                  {/* 즐겨찾기 */}
                  <td className="px-3 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteClick?.(complex);
                      }}
                      className="text-slate-300 hover:text-yellow-500 transition-colors"
                    >
                      <Star
                        size={16}
                        className={isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}
                      />
                    </button>
                  </td>

                  {/* 단지명 */}
                  <td
                    className="px-3 py-3 cursor-pointer"
                    onClick={() => onRowClick?.(complex)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {complex.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800 hover:text-blue-600">
                          {complex.name}
                        </div>
                        <div className="text-xs text-slate-400">{complex.dong}</div>
                      </div>
                    </div>
                  </td>

                  {/* 세대수 */}
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm text-slate-700">
                      {complex.totalUnits.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">세대</span>
                  </td>

                  {/* 면적 */}
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm text-slate-700">
                      {complex.avgPyeong.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">평</span>
                  </td>

                  {/* 건축년도 */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-slate-600">{complex.buildYear}</span>
                  </td>

                  {/* 매매 시세 */}
                  <td className="px-3 py-3 bg-blue-50/50">
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600">
                        {formatPrice(complex.tradePrice)}
                      </div>
                      <div className="text-xs text-slate-400">
                        평당 {formatPriceShort(complex.tradePricePerPyeong)}
                      </div>
                    </div>
                  </td>

                  {/* 전세 시세 */}
                  <td className="px-3 py-3 bg-green-50/50">
                    <div className="text-right">
                      {complex.jeonsePrice ? (
                        <>
                          <div className="text-sm font-bold text-green-600">
                            {formatPrice(complex.jeonsePrice)}
                          </div>
                          <div className="text-xs text-slate-400">
                            평당 {formatPriceShort(complex.jeonsePricePerPyeong || 0)}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-slate-300">-</span>
                      )}
                    </div>
                  </td>

                  {/* 증감 */}
                  <td className="px-3 py-3 text-right">
                    <div className={cn(
                      'flex items-center justify-end gap-1',
                      complex.changeType === 'up' && 'text-red-500',
                      complex.changeType === 'down' && 'text-blue-500',
                      complex.changeType === 'same' && 'text-slate-400'
                    )}>
                      {complex.changeType === 'up' && <TrendingUp size={14} />}
                      {complex.changeType === 'down' && <TrendingDown size={14} />}
                      {complex.changeType === 'same' && <Minus size={14} />}
                      <span className="text-sm font-medium">
                        {complex.priceChange !== 0
                          ? `${complex.priceChange > 0 ? '+' : ''}${formatPriceShort(Math.abs(complex.priceChange))}`
                          : '-'
                        }
                      </span>
                    </div>
                  </td>

                  {/* 전세율 */}
                  <td className="px-3 py-3 text-center">
                    {complex.jeonseRate ? (
                      <span className={cn(
                        'text-sm font-medium',
                        complex.jeonseRate >= 70 ? 'text-red-500' :
                        complex.jeonseRate >= 50 ? 'text-amber-500' : 'text-green-500'
                      )}>
                        {complex.jeonseRate}%
                      </span>
                    ) : (
                      <span className="text-sm text-slate-300">-</span>
                    )}
                  </td>

                  {/* 거래 건수 */}
                  <td className="px-3 py-3 text-center">
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      {complex.tradeCount}
                    </span>
                  </td>

                  {/* 지도 */}
                  <td className="px-3 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMapClick?.(complex);
                      }}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <MapPin size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          데이터가 없습니다.
        </div>
      )}
    </div>
  );
}
