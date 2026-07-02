import React from 'react';
import { Box, Button, TextField, MenuItem, Grid2 } from '@mui/material';

export default function StepAddress({ data, onChange, onNext, onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.country || !data.state || !data.city || !data.address || !data.postalCode) {
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
            select
            label="Country"
            value={data.country || ''}
            onChange={(e) => onChange('country', e.target.value)}
            required
            fullWidth
          >
            <MenuItem value="US">United States</MenuItem>
            <MenuItem value="IN">India</MenuItem>
            <MenuItem value="GB">United Kingdom</MenuItem>
            <MenuItem value="AU">Australia</MenuItem>
          </TextField>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="State / Province"
            value={data.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            required
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="City"
            value={data.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            required
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Postal Code"
            value={data.postalCode || ''}
            onChange={(e) => onChange('postalCode', e.target.value)}
            required
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Street Address"
            value={data.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            required
            fullWidth
            multiline
            rows={2}
          />
        </Grid2>
      </Grid2>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            textTransform: 'none',
            color: '#64748B',
            borderColor: '#CBD5E1',
            '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' },
          }}
        >
          Back
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
