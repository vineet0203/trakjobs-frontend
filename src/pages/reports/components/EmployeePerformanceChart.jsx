import React from 'react';
import { Box, Typography, Paper, MenuItem, Select, FormControl } from '@mui/material';
import { employeePerformanceData } from '../data/reportsDummyData';

const maxVal = Math.max(...employeePerformanceData.map(d => d.completedJobs));

const EmployeePerformanceChart = () => (
  <Paper elevation={0} sx={{
    p: 3, borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff',
    transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Employee Performance</Typography>
      <FormControl size="small" sx={{ minWidth: 110 }}>
        <Select defaultValue="jobs" sx={{ fontSize: 12, borderRadius: 2, height: 32, color: '#64748b' }}>
          <MenuItem value="jobs">By Jobs</MenuItem>
          <MenuItem value="hours">By Hours</MenuItem>
          <MenuItem value="revenue">By Revenue</MenuItem>
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {employeePerformanceData.map((emp, i) => {
        const pct = (emp.completedJobs / maxVal) * 100;
        return (
          <Box key={i}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{emp.name}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{emp.completedJobs}</Typography>
            </Box>
            <Box sx={{
              height: 24, bgcolor: '#f1f5f9', borderRadius: 2, overflow: 'hidden',
              position: 'relative',
            }}>
              <Box sx={{
                height: '100%', width: `${pct}%`,
                background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                borderRadius: 2, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: 1,
              }}>
                {pct > 20 && (
                  <Typography sx={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>{emp.completedJobs}</Typography>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: '#3b82f6' }} />
      <Typography sx={{ fontSize: 11, color: '#94a3b8' }}>Completed Jobs</Typography>
    </Box>
  </Paper>
);

export default EmployeePerformanceChart;
