import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Briefcase, DollarSign, FileText, CheckCircle,
  Users, Clock, TrendingUp, BarChart3
} from 'lucide-react';
import { kpiCards } from '../data/reportsDummyData';

const iconMap = {
  briefcase: Briefcase, dollar: DollarSign, invoice: FileText,
  check: CheckCircle, users: Users, clock: Clock,
  trending: TrendingUp, chart: BarChart3,
};

const KpiCard = ({ card, index }) => {
  const Icon = iconMap[card.icon] || Briefcase;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2.5, borderRadius: 3, border: '1px solid #e8edf5',
          bgcolor: '#fff', position: 'relative', overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
          cursor: 'default',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 28px ${card.color}18`,
            borderColor: `${card.color}40`,
          },
        }}
      >
        <Box sx={{
          position: 'absolute', top: -20, right: -20, width: 80, height: 80,
          borderRadius: '50%', bgcolor: `${card.color}08`,
        }} />
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: 2.5, bgcolor: card.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={20} color={card.color} strokeWidth={2} />
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.3,
            bgcolor: card.positive ? '#ecfdf5' : '#fef2f2',
            color: card.positive ? '#059669' : '#dc2626',
            px: 1, py: 0.3, borderRadius: 1.5, fontSize: 11, fontWeight: 700,
          }}>
            <TrendingUp size={11} />
            {card.growth}
          </Box>
        </Box>
        <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1.1, mb: 0.3 }}>
          {card.value}
        </Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {card.label}
        </Typography>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', mt: 0.5 }}>
          {card.period}
        </Typography>
      </Paper>
    </motion.div>
  );
};

const ReportsKpiCards = () => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)', xl: 'repeat(8, 1fr)' },
    gap: 2, mb: 3,
  }}>
    {kpiCards.map((card, i) => <KpiCard key={card.id} card={card} index={i} />)}
  </Box>
);

export default ReportsKpiCards;
