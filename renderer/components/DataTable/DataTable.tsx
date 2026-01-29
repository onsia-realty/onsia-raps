import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { downloadExcel } from '../../lib/excel';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: number;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  pageSize?: number;
  searchable?: boolean;
  exportable?: boolean;
  exportFileName?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  pageSize = 10,
  searchable = true,
  exportable = true,
  exportFileName = 'data',
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // 검색 필터링
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // 정렬
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  // 페이지네이션
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // 정렬 핸들러
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // 엑셀 다운로드
  const handleExport = () => {
    downloadExcel(sortedData, {
      fileName: exportFileName,
      columns: columns.map((col) => ({
        header: col.header,
        key: String(col.key),
        width: col.width || 15,
      })),
    });
  };

  return (
    <div className={cn('rounded-lg bg-white shadow-sm', className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
        <div className="flex items-center gap-3">
          {/* 검색 */}
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="검색..."
                className="rounded-md border border-slate-300 py-1.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}
          {/* 엑셀 다운로드 */}
          {exportable && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700"
            >
              <Download size={16} />
              엑셀
            </button>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-slate-600',
                    col.sortable !== false && 'cursor-pointer hover:bg-slate-100'
                  )}
                  style={{ width: col.width ? `${col.width}px` : 'auto' }}
                  onClick={() => col.sortable !== false && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && sortKey === col.key && (
                      sortOrder === 'asc' ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-sm text-slate-700"
                    >
                      {col.render
                        ? col.render(row[String(col.key)], row)
                        : String(row[String(col.key)] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <div className="text-sm text-slate-600">
            총 {sortedData.length}개 중 {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, sortedData.length)}개
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-md p-1.5 hover:bg-slate-100 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'rounded-md px-3 py-1 text-sm',
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-100'
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md p-1.5 hover:bg-slate-100 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
