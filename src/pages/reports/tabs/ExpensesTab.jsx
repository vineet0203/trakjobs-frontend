import React from 'react';
import { useReportsData } from '../data/reportsDummyData.jsx';
import { Box, Grid, Skeleton, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Receipt } from 'lucide-react';
import QuickFilters from '../components/QuickFilters';
import ReportsKpiCards from '../components/ReportsKpiCards';
import { RevenueSummaryPanel } from '../components/SidePanels';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ExpensesTab = ({ filters }) => {
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
        <Grid item xs={12} lg={4}>
          <motion.div variants={fadeUp}>
            <RevenueSummaryPanel data={data?.revenue_summary} />
          </motion.div>
        </Grid>
        
        <Grid item xs={12} lg={8}>
          <motion.div variants={fadeUp}>
            <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', bgcolor: '#fff' }}>
              <Box sx={{ 
                display: 'inline-flex', p: 2, borderRadius: '50%', 
                bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444', mb: 2 
              }}>
                <Receipt size={32} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>Expense Breakdown</Typography>
              <Typography sx={{ color: '#64748b', fontSize: 14, maxWidth: 500, mx: 'auto' }}>
                Total Expenses for this period: {data?.kpi_stats?.find(k => k.id === 'totalExpenses')?.value || '₹0'}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpensesTab;
