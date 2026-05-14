import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import ReportsKpiCards from '../components/ReportsKpiCards';
import RevenueChart from '../components/RevenueChart';
import JobStatusChart from '../components/JobStatusChart';
import InvoiceAnalyticsChart from '../components/InvoiceAnalyticsChart';
import ReportsTable from '../components/ReportsTable';
import {
  TopCustomersPanel, TopEmployeesPanel,
  RevenueSummaryPanel, RecentActivitiesPanel,
} from '../components/SidePanels';
import QuickFilters from '../components/QuickFilters';
import { useReportsData } from '../data/reportsDummyData.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const OverviewTab = ({ filters }) => {
  const { data, loading, error } = useReportsData();

  if (error) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="error" sx={{ fontWeight: 600 }}>{error}</Typography>
    </Box>
  );

  if (loading) return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="rectangular" height={600} sx={{ borderRadius: '16px' }} />
    </Box>
  );

  return (
    <Box>
      <motion.div variants={fadeUp}>
        <QuickFilters filters={filters} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <ReportsKpiCards data={data?.kpi_stats} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: '1.2fr 0.8fr 1fr' },
          gap: 2.5, mb: 3.5,
        }}>
          <RevenueChart data={data?.revenue_chart} />
          <JobStatusChart data={data?.job_status} />
          <InvoiceAnalyticsChart data={data?.invoice_analytics} />
        </Box>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' },
          gap: 2.5, mb: 3.5,
        }}>
          <ReportsTable data={data?.recent_jobs} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TopCustomersPanel data={data?.top_customers} />
            <TopEmployeesPanel data={data?.top_employees} />
          </Box>
        </Box>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.5,
        }}>
          <RevenueSummaryPanel data={data?.revenue_summary} />
          <RecentActivitiesPanel data={data?.recent_activities} />
        </Box>
      </motion.div>
    </Box>
  );
};

export default OverviewTab;
