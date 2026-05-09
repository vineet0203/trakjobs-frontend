import React from 'react';
import { Box, Typography, Paper, MenuItem, Select, FormControl } from '@mui/material';
import { invoiceAnalyticsData } from '../data/reportsDummyData';

const maxVal = Math.max(...invoiceAnalyticsData.map(d => d.paid + d.unpaid + d.overdue));
const barW = 16;

const InvoiceAnalyticsChart = () => {
  const chartH = 180;
  const groups = invoiceAnalyticsData.length;

  return (
    <Paper elevation={0} sx={{
      p: 3, borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff',
      transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Invoice Analytics</Typography>
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <Select defaultValue="monthly" sx={{ fontSize: 12, borderRadius: 2, height: 32, color: '#64748b' }}>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
        {[
          { label: 'Paid', color: '#10b981' },
          { label: 'Unpaid', color: '#f59e0b' },
          { label: 'Overdue', color: '#ef4444' },
        ].map((l, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: l.color }} />
            <Typography sx={{ fontSize: 11, color: '#94a3b8' }}>{l.label}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: chartH, pt: 1 }}>
        {invoiceAnalyticsData.map((d, i) => {
          const paidH = (d.paid / maxVal) * (chartH - 30);
          const unpaidH = (d.unpaid / maxVal) * (chartH - 30);
          const overdueH = (d.overdue / maxVal) * (chartH - 30);
          return (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
                <Box sx={{ width: barW, height: paidH, bgcolor: '#10b981', borderRadius: '3px 3px 0 0', transition: 'height 0.6s ease' }} />
                <Box sx={{ width: barW, height: unpaidH, bgcolor: '#f59e0b', borderRadius: '3px 3px 0 0', transition: 'height 0.6s ease' }} />
                <Box sx={{ width: barW, height: overdueH, bgcolor: '#ef4444', borderRadius: '3px 3px 0 0', transition: 'height 0.6s ease' }} />
              </Box>
              <Typography sx={{ fontSize: 10, color: '#94a3b8' }}>{d.month}</Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default InvoiceAnalyticsChart;
