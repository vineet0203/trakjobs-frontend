import React from 'react';
import { Box, Button, TextField, MenuItem, Grid2 } from '@mui/material';

export default function StepPersonal({ data, onChange, onNext, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.firstName || !data.lastName || !data.dob || !data.gender) {
      alert('Please fill out all required fields.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="First Name"
            value={data.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            required
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Last Name"
            value={data.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            required
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date of Birth"
            type="date"
            value={data.dob || ''}
            onChange={(e) => onChange('dob', e.target.value)}
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Gender"
            value={data.gender || ''}
            onChange={(e) => onChange('gender', e.target.value)}
            required
            fullWidth
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
            <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
          </TextField>
        </Grid2>
      </Grid2>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            textTransform: 'none',
            color: '#64748B',
            borderColor: '#CBD5E1',
            '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            textTransform: 'none',
            bgcolor: '#0F2744',
            '&:hover': { bgcolor: '#0A1B30' },
          }}
        >
          Next
        </Button>
      </Box>
    </form>
  );
}
