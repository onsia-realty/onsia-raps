import React from 'react';
import { MapPin, Calendar, Filter, TrendingUp, LayoutGrid, DollarSign } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface FilterState {
  region: string;
  period: string;
  priceFilter: 'all' | 'under5' | '5to10' | '10to20' | 'over20';
  complexFilter: 'all' | 'apartment' | 'officetel' | 'villa';
  changeType: 'all' | 'increase' | 'decrease';
  priceUnit: 'total' | 'pyeong';
  hasPrice: 'all' | 'hasPrice' | 'noPrice';
}

interface AnalysisFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  className?: string;
}

const periodOptions = [
  { value: '202601', label: '2026-01' },
  { value: '202512', label: '2025-12' },
  { value: '202511', label: '2025-11' },
  { value: '202510', label: '2025-10' },
  { value: '202509', label: '2025-09' },
  { value: '202508', label: '2025-08' },
];

const priceFilterOptions = [
  { value: 'all', label: '전체' },
  { value: 'under5', label: '5억 미만' },
  { value: '5to10', label: '5억~10억' },
  { value: '10to20', label: '10억~20억' },
  { value: 'over20', label: '20억 이상' },
];

const complexFilterOptions = [
  { value: 'all', label: '전체' },
  { value: 'apartment', label: '아파트' },
  { value: 'officetel', label: '오피스텔' },
  { value: 'villa', label: '빌라' },
];

const changeTypeOptions = [
  { value: 'all', label: '증감' },
  { value: 'increase', label: '상승' },
  { value: 'decrease', label: '하락' },
];

const priceUnitOptions = [
  { value: 'total', label: '전체 가격' },
  { value: 'pyeong', label: '평당 가격' },
];

const hasPriceOptions = [
  { value: 'all', label: '전체' },
  { value: 'hasPrice', label: '시세유' },
  { value: 'noPrice', label: '시세무' },
];

export function AnalysisFilters({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  className,
}: AnalysisFiltersProps) {
  return (
    <div className={cn('rounded-lg bg-blue-50 p-4', className)}>
      <div className="flex flex-wrap items-center gap-3">
        {/* 지역 */}
        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
          <MapPin size={16} className="text-slate-500" />
          <input
            type="text"
            placeholder="지역/단지"
            value={filters.region}
            onChange={(e) => onFilterChange('region', e.target.value)}
            className="w-32 border-none bg-transparent text-sm focus:outline-none"
          />
        </div>

        {/* 지역검색 버튼 */}
        <button
          onClick={onSearch}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          지역검색
        </button>

        {/* 기간 */}
        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
          <Calendar size={16} className="text-slate-500" />
          <select
            value={filters.period}
            onChange={(e) => onFilterChange('period', e.target.value)}
            className="border-none bg-transparent text-sm focus:outline-none"
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 가격필터 */}
        <FilterDropdown
          icon={<DollarSign size={14} />}
          label="가격필터"
          value={filters.priceFilter}
          options={priceFilterOptions}
          onChange={(v) => onFilterChange('priceFilter', v)}
        />

        {/* 단지필터 */}
        <FilterDropdown
          icon={<LayoutGrid size={14} />}
          label="단지필터"
          value={filters.complexFilter}
          options={complexFilterOptions}
          onChange={(v) => onFilterChange('complexFilter', v)}
        />

        {/* 변동기준 */}
        <FilterDropdown
          icon={<TrendingUp size={14} />}
          label="변동기준"
          value={filters.changeType}
          options={changeTypeOptions}
          onChange={(v) => onFilterChange('changeType', v)}
        />

        {/* 단위기준 */}
        <FilterDropdown
          icon={<Filter size={14} />}
          label="단위기준"
          value={filters.priceUnit}
          options={priceUnitOptions}
          onChange={(v) => onFilterChange('priceUnit', v)}
        />

        {/* 시세유무 */}
        <FilterDropdown
          icon={<Filter size={14} />}
          label="시세유무"
          value={filters.hasPrice}
          options={hasPriceOptions}
          onChange={(v) => onFilterChange('hasPrice', v)}
        />

        {/* 초기화 */}
        <button
          onClick={onReset}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          초기화
        </button>

        {/* 검색 */}
        <button
          onClick={onSearch}
          className="rounded-lg bg-slate-800 px-6 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          검색
        </button>
      </div>
    </div>
  );
}

interface FilterDropdownProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterDropdown({ icon, label, value, options, onChange }: FilterDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex items-center gap-1 rounded-lg bg-white px-3 py-2">
      <span className="text-slate-500">{icon}</span>
      <span className="text-xs text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-none bg-transparent text-sm font-medium text-slate-800 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {value !== 'all' && value !== options[0].value && (
        <button
          onClick={() => onChange(options[0].value)}
          className="ml-1 text-slate-400 hover:text-slate-600"
        >
          ×
        </button>
      )}
    </div>
  );
}
