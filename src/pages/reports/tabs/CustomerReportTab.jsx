import React from 'react';
import { Box, Paper, Typography, Grid, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import QuickFilters from '../components/QuickFilters';
import ReportsTable from '../components/ReportsTable';
import { TopCustomersPanel } from '../components/SidePanels';
import { useReportsData } from '../data/reportsDummyData.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CustomerReportTab = ({ filters }) => {
  const { data, loading, error } = useReportsData();

  if (loading) return <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />;
  if (error) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="error" sx={{ fontWeight: 600 }}>{error}</Typography></Box>;

  return (
    <Box>
      <motion.div variants={fadeUp}>
        <QuickFilters filters={filters} />
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <motion.div variants={fadeUp}>
            <ReportsTable title="Customer Jobs History" data={data?.recent_jobs} />
          </motion.div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <motion.div variants={fadeUp}>
              <TopCustomersPanel data={data?.top_customers} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <TrendingUp size={20} color="#2563eb" />
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Customer Insights</Typography>
                </Box>
                <Typography sx={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
                  Showing analytics for {data?.kpi_stats?.find(k => k.id === 'activeCustomers')?.value || '0'} active customers.
                </Typography>
              </Paper>
            </motion.div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerReportTab;
