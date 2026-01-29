import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface RegionStats {
  id: string;
  name: string;         // 지역명 (동)
  population: number;   // 인구수
  households: number;   // 세대수
  avgTradePrice: number; // 평균 매매가 (만원)
  avgJeonsePrice: number; // 평균 전세가 (만원)
  jeonseRatio: number;  // 전세율 (%)
  totalComplexes: number; // 전체 단지수
  totalUnits: number;   // 전체 세대수
  aptComplexes: number; // 아파트 단지수
  aptUnits: number;     // 아파트 세대수
  officetelComplexes: number; // 오피스텔 단지수
  officetelUnits: number;
  priceChange: number;  // 가격 변동률 (%)
  changeType: 'up' | 'down' | 'same';
}

interface RegionStatsTableProps {
  data: RegionStats[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onRowClick?: (region: RegionStats) => void;
}

export function RegionStatsTable({
  data,
  selectedIds,
  onSelect,
  onSelectAll,
  onRowClick,
}: RegionStatsTableProps) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}억`;
    }
    return `${price.toLocaleString()}`;
  };

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="w-10 px-3 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600">지역명</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600">인구수</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600">세대수</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600">매매가</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600">전세가</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600">전세율</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-600">
              <div>전체 단지수</div>
              <div className="text-slate-400 font-normal">면적별 세대수</div>
            </th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-600">
              <div>아파트 단지수</div>
              <div className="text-slate-400 font-normal">면적별 세대수</div>
            </th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-600">
              <div>오피스텔 단지수</div>
              <div className="text-slate-400 font-normal">면적별 세대수</div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((region) => {
            const isSelected = selectedIds.includes(region.id);
            return (
              <tr
                key={region.id}
                className={cn(
                  'transition-colors hover:bg-slate-50 cursor-pointer',
                  isSelected && 'bg-blue-50'
                )}
                onClick={() => onRowClick?.(region)}
              >
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(region.id)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <ExternalLink size={12} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-800">{region.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right text-sm text-slate-600">
                  {formatNumber(region.population)}
                </td>
                <td className="px-3 py-2.5 text-right text-sm text-slate-600">
                  {formatNumber(region.households)}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="text-sm font-medium text-slate-800">
                    {formatPrice(region.avgTradePrice)}
                  </div>
                  <PriceChange value={region.priceChange} type={region.changeType} />
                </td>
                <td className="px-3 py-2.5 text-right text-sm text-slate-600">
                  {formatPrice(region.avgJeonsePrice)}
                </td>
                <td className="px-3 py-2.5 text-right text-sm text-slate-600">
                  {region.jeonseRatio}%
                </td>
                <td className="px-3 py-2.5 text-center">
                  <div className="text-sm font-medium text-slate-800">{region.totalComplexes}단지</div>
                  <div className="text-xs text-slate-500">{formatNumber(region.totalUnits)}세대</div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <div className="text-sm font-medium text-slate-800">{region.aptComplexes}단지</div>
                  <div className="text-xs text-slate-500">{formatNumber(region.aptUnits)}세대</div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <div className="text-sm font-medium text-slate-800">{region.officetelComplexes}단지</div>
                  <div className="text-xs text-slate-500">{formatNumber(region.officetelUnits)}세대</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PriceChange({ value, type }: { value: number; type: 'up' | 'down' | 'same' }) {
  if (type === 'same' || value === 0) {
    return <div className="text-xs text-slate-400">-</div>;
  }

  return (
    <div
      className={cn(
        'text-xs font-medium',
        type === 'up' ? 'text-red-500' : 'text-blue-500'
      )}
    >
      {type === 'up' ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
    </div>
  );
}
