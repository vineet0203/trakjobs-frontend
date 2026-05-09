import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { quickFilterOptions } from '../data/reportsDummyData';

const QuickFilters = ({ activeFilter, setActiveFilter, filters }) => {
  const { customerFilter, setCustomerFilter, employeeFilter, setEmployeeFilter,
    jobStatusFilter, setJobStatusFilter, paymentFilter, setPaymentFilter,
    serviceFilter, setServiceFilter } = filters;

  return (
    <Box sx={{
      p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0f172a', mr: 1 }}>Quick Filters</Typography>
        <Box sx={{
          display: 'inline-flex', bgcolor: '#f1f5f9', borderRadius: 2, p: '3px',
        }}>
          {quickFilterOptions.map(opt => (
            <Button
              key={opt}
              size="small"
              onClick={() => setActiveFilter(opt)}
              sx={{
                textTransform: 'none', fontSize: 12, fontWeight: 600,
                px: 2, py: 0.5, borderRadius: 1.5, minWidth: 0,
                color: activeFilter === opt ? '#fff' : '#64748b',
                bgcolor: activeFilter === opt ? '#2563eb' : 'transparent',
                '&:hover': { bgcolor: activeFilter === opt ? '#1d4ed8' : '#e2e8f0' },
                transition: 'all 0.2s',
              }}
            >
              {opt}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto', flexWrap: 'wrap' }}>
          {[
            { label: 'Customer', value: customerFilter, set: setCustomerFilter, options: ['All Customers', 'ABC Corp', 'XYZ Services', 'PQR Solutions'] },
            { label: 'Employee', value: employeeFilter, set: setEmployeeFilter, options: ['All Employees', 'Ajinkya', 'Sagar', 'Rohit'] },
            { label: 'Job Status', value: jobStatusFilter, set: setJobStatusFilter, options: ['All Status', 'Completed', 'In Progress', 'Pending', 'Cancelled'] },
            { label: 'Payment Status', value: paymentFilter, set: setPaymentFilter, options: ['All Status', 'Paid', 'Unpaid', 'Overdue'] },
            { label: 'Service Type', value: serviceFilter, set: setServiceFilter, options: ['All Services', 'Installation', 'Maintenance', 'Repair'] },
          ].map((f, i) => (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {f.label}
              </Typography>
              <select
                value={f.value}
                onChange={e => f.set(e.target.value)}
                style={{
                  height: 32, borderRadius: 8, border: '1px solid #e2e8f0',
                  fontSize: 12, color: '#475569', padding: '0 10px',
                  background: '#fff', cursor: 'pointer', outline: 'none',
                  fontFamily: 'Poppins, sans-serif', minWidth: 130,
                }}
              >
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined"
            onClick={() => {
              setCustomerFilter('All Customers');
              setEmployeeFilter('All Employees');
              setJobStatusFilter('All Status');
              setPaymentFilter('All Status');
              setServiceFilter('All Services');
              setActiveFilter('Monthly');
            }}
            sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600, borderRadius: 2, borderColor: '#cbd5e1', color: '#64748b', height: 32 }}
          >
            Reset
          </Button>
          <Button size="small" variant="contained"
            sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600, borderRadius: 2, bgcolor: '#2563eb', height: 32, boxShadow: 'none', '&:hover': { bgcolor: '#1d4ed8' } }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QuickFilters;
