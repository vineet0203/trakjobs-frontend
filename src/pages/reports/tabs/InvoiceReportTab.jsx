import React from 'react';
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import QuickFilters from '../components/QuickFilters';
import InvoiceAnalyticsChart from '../components/InvoiceAnalyticsChart';
import ReportsTable from '../components/ReportsTable';
import { useReportsData } from '../data/reportsDummyData.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const InvoiceReportTab = ({ filters }) => {
  const { data, loading, error } = useReportsData();

  if (loading) return <Box sx={{ p: 4 }}><Skeleton variant="rectangular" height={500} sx={{ borderRadius: '16px' }} /></Box>;
  if (error) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="error" sx={{ fontWeight: 600 }}>{error}</Typography></Box>;

  return (
    <Box>
      <motion.div variants={fadeUp}>
        <QuickFilters filters={filters} />
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <motion.div variants={fadeUp}>
            <InvoiceAnalyticsChart data={data?.invoice_analytics} />
          </motion.div>
        </Grid>

        <Grid item xs={12} lg={7}>
          <motion.div variants={fadeUp}>
            <ReportsTable title="Invoicing History" data={data?.recent_jobs} />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceReportTab;
