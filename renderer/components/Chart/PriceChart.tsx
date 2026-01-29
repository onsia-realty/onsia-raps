import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { cn } from '../../lib/cn';

interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

interface PriceChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar';
  dataKeys: { key: string; name: string; color: string }[];
  title?: string;
  yAxisLabel?: string;
  className?: string;
}

export function PriceChart({
  data,
  type = 'line',
  dataKeys,
  title,
  yAxisLabel,
  className,
}: PriceChartProps) {
  const formatYAxis = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}억`;
    }
    return `${value.toLocaleString()}만`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <p className="mb-2 font-medium text-slate-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatYAxis(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn('rounded-lg bg-white p-4 shadow-sm', className)}>
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        {type === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: '#64748b', fontSize: 12 }}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#64748b',
                    }
                  : undefined
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {dataKeys.map((dk) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.name}
                stroke={dk.color}
                strokeWidth={2}
                dot={{ fill: dk.color, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: '#64748b', fontSize: 12 }}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#64748b',
                    }
                  : undefined
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {dataKeys.map((dk) => (
              <Bar key={dk.key} dataKey={dk.key} name={dk.name} fill={dk.color} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
