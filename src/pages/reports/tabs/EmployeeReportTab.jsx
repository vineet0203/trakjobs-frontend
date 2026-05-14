import React from 'react';
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import QuickFilters from '../components/QuickFilters';
import EmployeePerformanceChart from '../components/EmployeePerformanceChart';
import { TopEmployeesPanel } from '../components/SidePanels';
import ReportsTable from '../components/ReportsTable';
import { useReportsData } from '../data/reportsDummyData.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EmployeeReportTab = ({ filters }) => {
  const { data, loading, error } = useReportsData();

  if (loading) return <Box sx={{ p: 4 }}><Skeleton variant="rectangular" height={500} sx={{ borderRadius: '16px' }} /></Box>;
  if (error) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="error" sx={{ fontWeight: 600 }}>{error}</Typography></Box>;

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
