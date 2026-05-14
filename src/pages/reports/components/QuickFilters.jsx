import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import customerService from '../../../features/customers/services/customerService';
import employeeService from '../../../features/employees/services/employeeService';

const QuickFilters = ({ activeFilter, setActiveFilter, filters }) => {
  const { onApply } = filters;
  const { customerFilter, setCustomerFilter, employeeFilter, setEmployeeFilter,
    jobStatusFilter, setJobStatusFilter } = filters;
  const [customers, setCustomers] = useState([{ id: 'All Customers', name: 'All Customers' }]);
  const [employees, setEmployees] = useState([{ id: 'All Employees', name: 'All Employees' }]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerService.getAll({ per_page: 100 });
        const customerData = Array.isArray(response) ? response : (response?.data || []);
        const customerOptions = customerData.map(c => ({
          id: c.client_type === 'commercial' ? c.business_name : `${c.first_name} ${c.last_name}`,
          name: c.client_type === 'commercial' ? c.business_name : `${c.first_name} ${c.last_name}`,
        }));
        setCustomers([{ id: 'All Customers', name: 'All Customers' }, ...customerOptions]);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getAll({ per_page: 100 });
        const employeeData = Array.isArray(response) ? response : (response?.data || []);
        const employeeOptions = employeeData.map(e => ({
          id: e.name || `${e.first_name ?? ''} ${e.last_name ?? ''}`.trim(),
          name: e.name || `${e.first_name ?? ''} ${e.last_name ?? ''}`.trim(),
        }));
        setEmployees([{ id: 'All Employees', name: 'All Employees' }, ...employeeOptions]);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };
    fetchEmployees();
  }, []);

  const filterOptions = [
    {
      label: 'Customer', value: customerFilter, set: setCustomerFilter,
      options: customers,
    },
    {
      label: 'Employee', value: employeeFilter, set: setEmployeeFilter,
      options: employees,
    },
    {
      label: 'Job Status', value: jobStatusFilter, set: setJobStatusFilter,
      options: [
        { id: 'All Status',   name: 'All Status' },
        { id: 'pending',      name: 'Pending' },
        { id: 'scheduled',    name: 'Scheduled' },
        { id: 'in_progress',  name: 'In Progress' },
        { id: 'completed',    name: 'Completed' },
        { id: 'cancelled',    name: 'Cancelled' },
      ],
    },
  ];

  return (
    <Box sx={{
      p: '18px 22px', mb: 3, borderRadius: '16px',
      border: '1px solid rgba(226,232,240,0.8)', bgcolor: '#fff',
      boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {filterOptions.map((f, i) => (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
              <Typography sx={{
                fontSize: 10, fontWeight: 700, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {f.label}
              </Typography>
              <select
                value={f.value}
                onChange={e => f.set(e.target.value)}
                style={{
                  height: 34, borderRadius: 10, border: '1px solid #e8edf5',
                  fontSize: 12, color: '#475569', padding: '0 12px 0 10px',
                  background: '#fafbfd', cursor: 'pointer', outline: 'none',
                  fontFamily: 'Poppins, sans-serif', minWidth: 130,
                  appearance: 'auto',
                }}
              >
                {f.options.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button size="small" variant="contained" onClick={onApply}
            sx={{
              textTransform: 'none', fontSize: 12, fontWeight: 600,
              borderRadius: '10px', height: 34, px: 3,
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
              '&:hover': { bgcolor: '#1d4ed8' },
            }}>
            Apply Filters
          </Button>
          <Button size="small" variant="outlined"
            onClick={() => {
              setCustomerFilter('All Customers');
              setEmployeeFilter('All Employees');
              setJobStatusFilter('All Status');
              setActiveFilter('Monthly');
            }}
            sx={{
              textTransform: 'none', fontSize: 12, fontWeight: 600,
              borderRadius: '10px', borderColor: '#e2e8f0', color: '#64748b', height: 34,
              '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
            }}>
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QuickFilters;
