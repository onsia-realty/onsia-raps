import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface RankingItem {
  rank: number;
  name: string;
  subName?: string;
  value: number;
  change: number;
  changeType: 'up' | 'down' | 'same';
}

interface RankingCardProps {
  title: string;
  icon: React.ReactNode;
  items: RankingItem[];
  valueLabel?: string;
  valueFormatter?: (value: number) => string;
  accentColor?: string;
}

const defaultFormatter = (value: number) => value.toLocaleString();

export function RankingCard({
  title,
  icon,
  items,
  valueLabel = '만원',
  valueFormatter = defaultFormatter,
  accentColor = 'blue',
}: RankingCardProps) {
  const colorClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    green: 'bg-green-600',
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg text-white',
            colorClasses[accentColor as keyof typeof colorClasses] || colorClasses.blue
          )}
        >
          {icon}
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>

      {/* 랭킹 리스트 */}
      <div className="flex-1 divide-y divide-slate-50">
        {items.slice(0, 10).map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50"
          >
            {/* 순위 */}
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                item.rank <= 3
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-slate-100 text-slate-500'
              )}
            >
              {item.rank}
            </div>

            {/* 이름 */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {item.name}
              </p>
              {item.subName && (
                <p className="truncate text-xs text-slate-500">{item.subName}</p>
              )}
            </div>

            {/* 값 & 변동률 */}
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">
                {valueFormatter(item.value)}
                <span className="text-xs font-normal text-slate-500 ml-0.5">
                  {valueLabel}
                </span>
              </span>
              <ChangeIndicator change={item.change} type={item.changeType} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangeIndicator({
  change,
  type,
}: {
  change: number;
  type: 'up' | 'down' | 'same';
}) {
  if (type === 'same' || change === 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-slate-400">
        <Minus size={12} />
        <span>0%</span>
      </span>
    );
  }

  const isUp = type === 'up';
  return (
    <span
      className={cn(
        'flex items-center gap-0.5 text-xs font-medium',
        isUp ? 'text-red-500' : 'text-blue-500'
      )}
    >
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      <span>
        {isUp ? '+' : ''}
        {change.toFixed(1)}%
      </span>
    </span>
  );
}
