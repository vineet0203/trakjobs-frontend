import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { jobStatusData } from '../data/reportsDummyData';

const total = jobStatusData.reduce((s, d) => s + d.value, 0);

const JobStatusChart = () => {
  let cumulative = 0;
  const radius = 70;
  const stroke = 22;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * radius;

  return (
    <Paper elevation={0} sx={{
      p: 3, borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff',
      transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
    }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a', mb: 2 }}>Jobs Status</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
          <svg viewBox="0 0 200 200" width="100%">
            {jobStatusData.map((seg, i) => {
              const pct = seg.value / total;
              const dashLen = pct * circumference;
              const dashOff = -(cumulative / total) * circumference;
              cumulative += seg.value;
              return (
                <circle
                  key={i}
                  cx={cx} cy={cy} r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                  strokeDashoffset={dashOff}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              );
            })}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#0f172a" fontSize="28" fontWeight="800" fontFamily="Poppins">{total}</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Poppins">Total Jobs</text>
          </svg>
        </Box>
        <Box sx={{ flex: 1 }}>
          {jobStatusData.map((seg, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: seg.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 13, color: '#475569', flex: 1 }}>{seg.label}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0f172a', mr: 1 }}>{seg.value}</Typography>
              <Typography sx={{ fontSize: 11, color: '#94a3b8' }}>({seg.percent})</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default JobStatusChart;
