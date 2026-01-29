import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useRegionStore, getSidoList, RegionCode } from '../../stores/regionStore';

interface RegionSelectorProps {
  showDateRange?: boolean;
  onSearch?: () => void;
  className?: string;
}

export function RegionSelector({ showDateRange = true, onSearch, className }: RegionSelectorProps) {
  const {
    selectedSido,
    selectedGugun,
    gugunList,
    startYear,
    startMonth,
    endYear,
    endMonth,
    setSido,
    setGugun,
    setDateRange,
  } = useRegionStore();

  const sidoList = getSidoList();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleSidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const sido = sidoList.find((s) => s.code === code) || null;
    setSido(sido);
  };

  const handleGugunChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const gugun = gugunList.find((g) => g.code === code) || null;
    setGugun(gugun);
  };

  return (
    <div className={cn('rounded-lg bg-white p-4 shadow-sm', className)}>
      <div className="flex flex-wrap items-end gap-4">
        {/* 지역 선택 */}
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-slate-500" />
          <div className="flex gap-2">
            {/* 시도 선택 */}
            <select
              value={selectedSido?.code || ''}
              onChange={handleSidoChange}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">시/도 선택</option>
              {sidoList.map((sido) => (
                <option key={sido.code} value={sido.code}>
                  {sido.name}
                </option>
              ))}
            </select>

            {/* 구군 선택 */}
            <select
              value={selectedGugun?.code || ''}
              onChange={handleGugunChange}
              disabled={!selectedSido || gugunList.length === 0}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">시/군/구 선택</option>
              {gugunList.map((gugun) => (
                <option key={gugun.code} value={gugun.code}>
                  {gugun.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 기간 선택 */}
        {showDateRange && (
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-500" />
            <div className="flex items-center gap-2">
              {/* 시작 년월 */}
              <select
                value={startYear}
                onChange={(e) => setDateRange(Number(e.target.value), startMonth, endYear, endMonth)}
                className="rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
              <select
                value={startMonth}
                onChange={(e) => setDateRange(startYear, Number(e.target.value), endYear, endMonth)}
                className="rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>

              <span className="text-slate-500">~</span>

              {/* 종료 년월 */}
              <select
                value={endYear}
                onChange={(e) => setDateRange(startYear, startMonth, Number(e.target.value), endMonth)}
                className="rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
              <select
                value={endMonth}
                onChange={(e) => setDateRange(startYear, startMonth, endYear, Number(e.target.value))}
                className="rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 검색 버튼 */}
        {onSearch && (
          <button
            onClick={onSearch}
            disabled={!selectedGugun}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-400"
          >
            검색
          </button>
        )}
      </div>

      {/* 선택된 지역 표시 */}
      {selectedSido && (
        <div className="mt-3 text-sm text-slate-600">
          선택 지역: {selectedSido.name}
          {selectedGugun && ` > ${selectedGugun.name}`}
        </div>
      )}
    </div>
  );
}
