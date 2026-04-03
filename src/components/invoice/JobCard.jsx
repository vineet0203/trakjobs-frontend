import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const JobCard = ({ job, selectedView }) => {
  const showChip = selectedView !== 'month';
  const showRateInline = selectedView !== 'month';

  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 1.05, position: 'relative' }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          bgcolor: '#2f73d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 0.25,
          flexShrink: 0,
        }}
      >
        <WorkOutlineIcon sx={{ color: '#fff', fontSize: 20 }} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303747', lineHeight: 1.15 }}>
              Job ID: {job.jobId}
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303747', lineHeight: 1.25 }}>
              Job Name: {job.jobName}
            </Typography>
          </Box>

          {showChip && (
            <Chip
              label={job.viewType}
              sx={{
                bgcolor: '#f5e7d3',
                color: '#4a3f34',
                fontSize: 13,
                fontWeight: 500,
                height: 30,
                borderRadius: 12,
                px: 0.5,
                minWidth: 90,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.25 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303747' }}>Date: {job.date}</Typography>
          {showRateInline && (
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303747' }}>
              Job Rate: ${job.rate}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default JobCard;