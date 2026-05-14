import React from 'react';
import { useReportsData } from '../data/reportsDummyData.jsx';
import { Box, Grid, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import QuickFilters from '../components/QuickFilters';
import ReportsKpiCards from '../components/ReportsKpiCards';
import EmployeePerformanceChart from '../components/EmployeePerformanceChart';
import { RecentActivitiesPanel } from '../components/SidePanels';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PerformanceTab = ({ filters }) => {
  const { data, loading, error } = useReportsData();



  if (loading) return <Box sx={{ p: 4 }}><Skeleton variant="rectangular" height={500} sx={{ borderRadius: '16px' }} /></Box>;

  return (
    <Box>
      <motion.div variants={fadeUp}>
        <QuickFilters filters={filters} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <ReportsKpiCards data={data?.kpi_stats} />
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <motion.div variants={fadeUp}>
            <EmployeePerformanceChart data={data?.employee_performance} />
          </motion.div>
        </Grid>
        
        <Grid item xs={12} lg={5}>
          <motion.div variants={fadeUp}>
            <RecentActivitiesPanel data={data?.recent_activities} />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceTab;
