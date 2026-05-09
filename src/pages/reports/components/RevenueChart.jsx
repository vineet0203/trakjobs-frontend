import React from 'react';
import { Box, Typography, Paper, MenuItem, Select, FormControl } from '@mui/material';
import { revenueData } from '../data/reportsDummyData';

const maxVal = Math.max(...revenueData.map(d => d.value));
const chartH = 200;
const chartW = 400;
const padL = 50;
const padB = 30;
const padT = 20;
const padR = 20;
const plotW = chartW - padL - padR;
const plotH = chartH - padT - padB;

const getPoint = (i, val) => {
  const x = padL + (i / (revenueData.length - 1)) * plotW;
  const y = padT + plotH - (val / maxVal) * plotH;
  return { x, y };
};

const pathD = revenueData.map((d, i) => {
  const { x, y } = getPoint(i, d.value);
  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
}).join(' ');

const areaD = pathD + ` L ${padL + plotW} ${padT + plotH} L ${padL} ${padT + plotH} Z`;

const yTicks = [0, 20000, 40000, 60000, 80000];

const RevenueChart = () => (
  <Paper elevation={0} sx={{
    p: 3, borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff',
    transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Revenue Overview</Typography>
      <FormControl size="small" sx={{ minWidth: 110 }}>
        <Select defaultValue="monthly" sx={{ fontSize: 12, borderRadius: 2, height: 32, color: '#64748b' }}>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </FormControl>
    </Box>
    <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {yTicks.map(t => {
        const y = padT + plotH - (t / maxVal) * plotH;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={padL - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="Poppins">
              ${(t / 1000).toFixed(0)}K
            </text>
          </g>
        );
      })}
      <path d={areaD} fill="url(#revGrad)" />
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {revenueData.map((d, i) => {
        const { x, y } = getPoint(i, d.value);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
            <text x={x} y={padT + plotH + 18} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Poppins">
              {d.month}
            </text>
          </g>
        );
      })}
      {(() => {
        const last = revenueData[revenueData.length - 1];
        const { x, y } = getPoint(revenueData.length - 1, last.value);
        return (
          <g>
            <rect x={x - 32} y={y - 28} width="64" height="20" rx="4" fill="#2563eb" />
            <text x={x} y={y - 15} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600" fontFamily="Poppins">
              ${(last.value / 1000).toFixed(1)}K
            </text>
          </g>
        );
      })()}
    </svg>
  </Paper>
);

export default RevenueChart;
