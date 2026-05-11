import React, { useState, useEffect } from 'react';
import { Box, Grid, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import QuickFilters from '../components/QuickFilters';
import EmployeePerformanceChart from '../components/EmployeePerformanceChart';
import { TopEmployeesPanel } from '../components/SidePanels';
import ReportsTable from '../components/ReportsTable';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EmployeeReportTab = ({ filters }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        const response = await axios.get('https://api.trakjobs.com/api/v1/vendors/reports/overview', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.response?.data?.message || 'Failed to fetch employee data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [filters.activeFilter]);

  if (loading) return <Box sx={{ p: 4 }}><Skeleton variant="rectangular" height={500} sx={{ borderRadius: '16px' }} /></Box>;

  return (
    <Box>
      <motion.div variants={fadeUp}>
        <QuickFilters filters={filters} />
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <motion.div variants={fadeUp}>
            <EmployeePerformanceChart data={data?.employee_performance} />
          </motion.div>
          <Box sx={{ mt: 3 }}>
            <motion.div variants={fadeUp}>
              <ReportsTable title="Employee Assignments" data={data?.recent_jobs} />
            </motion.div>
          </Box>
        </Grid>
        
        <Grid item xs={12} lg={5}>
          <motion.div variants={fadeUp}>
            <TopEmployeesPanel data={data?.top_employees} />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeReportTab;
