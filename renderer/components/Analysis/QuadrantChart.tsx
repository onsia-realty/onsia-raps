import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

export interface QuadrantDataPoint {
  id: string;
  name: string;
  tradePrice: number;  // 매매가 (억 단위)
  jeonsePrice: number; // 전세가 (억 단위)
  jeonseRatio: number; // 전세율
  priceChange: number; // 가격 변동률
  changeType: 'up' | 'down' | 'same';
  size?: number;       // 점 크기 (세대수 비례)
}

interface QuadrantChartProps {
  data: QuadrantDataPoint[];
  title?: string;
  onPointClick?: (point: QuadrantDataPoint) => void;
}

const getPointColor = (changeType: 'up' | 'down' | 'same') => {
  switch (changeType) {
    case 'up':
      return '#f87171'; // red-400
    case 'down':
      return '#60a5fa'; // blue-400
    default:
      return '#fbbf24'; // yellow-400 (보합)
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as QuadrantDataPoint;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
        <p className="font-semibold text-slate-800">{data.name}</p>
        <div className="mt-1 space-y-1 text-sm">
          <p className="text-slate-600">
            매매: <span className="font-medium text-slate-800">{data.tradePrice.toFixed(1)}억</span>
          </p>
          <p className="text-slate-600">
            전세: <span className="font-medium text-slate-800">{data.jeonsePrice.toFixed(1)}억</span>
          </p>
          <p className="text-slate-600">
            전세율: <span className="font-medium text-slate-800">{data.jeonseRatio}%</span>
          </p>
          <p className={`font-medium ${
            data.changeType === 'up' ? 'text-red-500' :
            data.changeType === 'down' ? 'text-blue-500' : 'text-yellow-600'
          }`}>
            {data.changeType === 'up' ? '▲' : data.changeType === 'down' ? '▼' : '●'}
            {' '}{Math.abs(data.priceChange).toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function QuadrantChart({ data, title, onPointClick }: QuadrantChartProps) {
  // X축, Y축 범위 계산
  const tradePrices = data.map(d => d.tradePrice);
  const jeonsePrices = data.map(d => d.jeonsePrice);

  const xMin = Math.floor(Math.min(...tradePrices) * 0.9);
  const xMax = Math.ceil(Math.max(...tradePrices) * 1.1);
  const yMin = Math.floor(Math.min(...jeonsePrices) * 0.9);
  const yMax = Math.ceil(Math.max(...jeonsePrices) * 1.1);

  // 중간값 계산 (4분면 기준선)
  const xMid = (xMin + xMax) / 2;
  const yMid = (yMin + yMax) / 2;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          {title || '4분면'}
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-blue-400"></span>
            <span className="text-slate-600">매매(좌측)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-blue-400 opacity-50"></span>
            <span className="text-slate-600">전세(우측)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
            <span className="text-slate-600">보합</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-red-400"></span>
            <span className="text-slate-600">상승</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-blue-400"></span>
            <span className="text-slate-600">하락</span>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

          <XAxis
            type="number"
            dataKey="tradePrice"
            name="매매"
            unit="억"
            domain={[xMin, xMax]}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
            label={{
              value: '매매',
              position: 'bottom',
              offset: 20,
              style: { fontSize: 12, fill: '#64748b' },
            }}
          />

          <YAxis
            type="number"
            dataKey="jeonsePrice"
            name="전세"
            unit="억"
            domain={[yMin, yMax]}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
            label={{
              value: '전세',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#64748b' },
            }}
          />

          {/* 4분면 기준선 */}
          <ReferenceLine x={xMid} stroke="#94a3b8" strokeDasharray="5 5" />
          <ReferenceLine y={yMid} stroke="#94a3b8" strokeDasharray="5 5" />

          <Tooltip content={<CustomTooltip />} />

          <Scatter
            data={data}
            onClick={(data) => onPointClick?.(data as unknown as QuadrantDataPoint)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getPointColor(entry.changeType)}
                fillOpacity={0.7}
                stroke={getPointColor(entry.changeType)}
                strokeWidth={1}
                cursor="pointer"
                r={entry.size || 8}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* 4분면 레이블 */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
        <div className="text-right pr-4">저가-고전세율</div>
        <div className="pl-4">고가-고전세율</div>
        <div className="text-right pr-4">저가-저전세율</div>
        <div className="pl-4">고가-저전세율</div>
      </div>
    </div>
  );
}
