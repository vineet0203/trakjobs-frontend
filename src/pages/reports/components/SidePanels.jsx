import React from 'react';
import { Box, Typography, Paper, Chip, IconButton } from '@mui/material';
import { MoreHorizontal } from 'lucide-react';
import { topCustomers, topEmployees, revenueSummary, recentActivities } from '../data/reportsDummyData';

const SectionHeader = ({ title, action }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
    <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</Typography>
    {action && (
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#2563eb', cursor: 'pointer', '&:hover': { color: '#1d4ed8' } }}>
        View All
      </Typography>
    )}
  </Box>
);

export const TopCustomersPanel = () => (
  <Paper elevation={0} sx={{
    p: 2.5, borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff',
    transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
  }}>
    <SectionHeader title="Top Customers" action />
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px', gap: 1, pb: 1, borderBottom: '1px solid #f1f5f9' }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Customer</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Total Jobs</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Revenue</Typography>
      </Box>
      {topCustomers.map((c, i) => (
        <Box key={i} sx={{
          display: 'grid', gridTemplateColumns: '1fr 80px 100px', gap: 1,
          py: 1.2, borderBottom: i < topCustomers.length - 1 ? '1px solid #f8fafc' : 'none',
          '&:hover': { bgcolor: '#f8fafc' }, borderRadius: 1, transition: 'background 0.2s',
        }}>
          <Typography sx={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{c.name}</Typography>
          <Typography sx={{ fontSize: 13, color: '#475569', textAlign: 'center' }}>{c.totalJobs}</Typography>
          <Typography sx={{ fontSize: 13, color: '#059669', fontWeight: 600, textAlign: 'right' }}>{c.revenue}</Typography>
        </Box>
      ))}
    </Box>
  </Paper>
);

export const TopEmployeesPanel = () => (
  <Paper elevation={0} sx={{
    p: 2.5, borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff',
    transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
  }}>
    <SectionHeader title="Top Employees" action />
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px', gap: 1, pb: 1, borderBottom: '1px solid #f1f5f9' }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Employee</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Hours</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Completed Jobs</Typography>
      </Box>
      {topEmployees.map((e, i) => (
        <Box key={i} sx={{
          display: 'grid', gridTemplateColumns: '1fr 70px 100px', gap: 1,
          py: 1.2, borderBottom: i < topEmployees.length - 1 ? '1px solid #f8fafc' : 'none',
          '&:hover': { bgcolor: '#f8fafc' }, borderRadius: 1, transition: 'background 0.2s',
        }}>
          <Typography sx={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{e.name}</Typography>
          <Typography sx={{ fontSize: 13, color: '#475569', textAlign: 'center' }}>{e.hours}</Typography>
          <Typography sx={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textAlign: 'right' }}>{e.completedJobs}</Typography>
        </Box>
      ))}
    </Box>
  </Paper>
);

export const RevenueSummaryPanel = () => (
  <Paper elevation={0} sx={{
    p: 2.5, borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff',
    transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
  }}>
    <SectionHeader title="Revenue Summary" />
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 2 }}>
      {[
        { label: 'Total Revenue', value: revenueSummary.totalRevenue, growth: revenueSummary.revenueGrowth, color: '#059669' },
        { label: 'Total Expenses', value: revenueSummary.totalExpenses, growth: revenueSummary.expenseGrowth, color: '#d97706' },
        { label: 'Net Profit', value: revenueSummary.netProfit, growth: revenueSummary.profitGrowth, color: '#2563eb' },
      ].map((item, i) => (
        <Box key={i} sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, mb: 0.5 }}>{item.label}</Typography>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0f172a', mb: 0.3 }}>{item.value}</Typography>
          <Typography sx={{ fontSize: 11, color: item.color, fontWeight: 600 }}>{item.growth} vs Apr 2024</Typography>
        </Box>
      ))}
    </Box>
    <Box sx={{ height: 60, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 300 50" width="100%" height="50" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revSumGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 0 40 Q 50 30, 75 25 T 150 15 T 225 20 T 300 10 L 300 50 L 0 50 Z" fill="url(#revSumGrad)" />
        <path d="M 0 40 Q 50 30, 75 25 T 150 15 T 225 20 T 300 10" fill="none" stroke="#3b82f6" strokeWidth="2" />
      </svg>
    </Box>
  </Paper>
);

export const RecentActivitiesPanel = () => {
  const typeColors = {
    job: '#2563eb', invoice: '#059669', status: '#d97706', customer: '#7c3aed', completed: '#10b981',
  };
  return (
    <Paper elevation={0} sx={{
      p: 2.5, borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff',
      transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
    }}>
      <SectionHeader title="Recent Activities" />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {recentActivities.map((a, i) => (
          <Box key={i} sx={{
            display: 'flex', gap: 1.5, py: 1.2,
            borderBottom: i < recentActivities.length - 1 ? '1px solid #f8fafc' : 'none',
          }}>
            <Box sx={{
              width: 8, height: 8, borderRadius: '50%', mt: 0.6, flexShrink: 0,
              bgcolor: typeColors[a.type] || '#94a3b8',
            }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 12.5, color: '#1e293b', lineHeight: 1.4 }}>{a.text}</Typography>
              {a.by && <Typography sx={{ fontSize: 11, color: '#94a3b8' }}>by {a.by}</Typography>}
            </Box>
            <Typography sx={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap' }}>{a.time}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
