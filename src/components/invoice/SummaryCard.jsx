import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const SummaryCard = ({ data }) => {
  const rows = [
    { label: 'Weekly Amount', value: data.weeklyAmount },
    { label: 'Milage', value: data.milage },
    { label: 'Other Expense', value: data.otherExpense },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid #ececec',
        overflow: 'hidden',
      }}
    >
      <Typography sx={{ px: 2, py: 1.4, fontSize: 24, fontWeight: 700, color: '#3c4351' }}>
        Summary
      </Typography>

      {rows.map((row) => (
        <Box
          key={row.label}
          sx={{
            px: 2,
            py: 1.2,
            borderTop: '1px solid #e8e8e8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: 14, color: '#4a5160', fontWeight: 600 }}>{row.label}</Typography>
          <Typography sx={{ fontSize: 14, color: '#404857', fontWeight: 600 }}>{row.value}</Typography>
        </Box>
      ))}

      <Box sx={{ px: 2, py: 1.4, borderTop: '1px solid #ececec' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 14, color: '#444b59', fontWeight: 700 }}>Total</Typography>
          <Box
            sx={{
              bgcolor: '#f0e5e2',
              px: 1.25,
              py: 0.3,
              borderRadius: 1.5,
              color: '#444b59',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {data.total}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SummaryCard;