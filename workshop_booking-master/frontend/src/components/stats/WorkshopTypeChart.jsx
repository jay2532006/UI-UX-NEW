import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Curated color palette for the chart segments
const COLORS = [
  '#1A56DB', '#0E9F6E', '#E3A008', '#E02424', '#7C3AED',
  '#0891B2', '#DB2777', '#059669', '#D97706', '#4F46E5',
];

/**
 * WorkshopTypeChart — interactive donut/pie chart using Recharts.
 * MASTER_PROMPT Section 5.5: "Click a segment to filter the list below."
 *
 * @param {Array} data - Array of { name, count } objects
 * @param {function} onSegmentClick - Callback when a segment is clicked, receives { name, count }
 */
export default function WorkshopTypeChart({ data = [], onSegmentClick }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-fossee-border bg-fossee-card p-5 md:p-6 shadow-card text-center text-fossee-muted">
        No workshop type data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name || item.type || 'Unknown',
    value: item.count || item.total || 0,
  }));

  const handleClick = (entry) => {
    if (onSegmentClick) {
      onSegmentClick(entry);
    }
  };

  return (
    <div className="rounded-2xl border border-fossee-border bg-fossee-card p-5 md:p-6 shadow-card">
      <h3 className="font-bold text-lg text-fossee-dark mb-4">Workshops by Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            onClick={(_, idx) => handleClick(chartData[idx])}
            style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
          >
            {chartData.map((_, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={COLORS[idx % COLORS.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
              fontSize: '13px',
            }}
            formatter={(value, name) => [`${value} workshops`, name]}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
