// features/quotes/components/QuoteTable/QuoteTableHeader.jsx
import React from 'react';
import { TableHead, TableRow, TableCell, Checkbox } from '@mui/material';

const QuoteTableHeader = ({ selectAll = false, onSelectAll, showCheckbox = true }) => {
  return (
    <TableHead>
      <TableRow 
        sx={{ 
          backgroundColor: '#f9fafb',
          '& .MuiTableCell-root': {
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#374151',
            borderBottom: '1px solid',
            borderColor: '#e5e7eb',
            py: '12px',
          },
          '& .MuiTableCell-root:first-of-type': {
            pl: '16px',
            pr: '8px', // Consistent padding for checkbox cell
          },
          '& .MuiTableCell-root:last-of-type': {
            pr: '16px',
          }
        }}
      >
        {showCheckbox && (
          <TableCell padding="checkbox" sx={{ width: 50 }}>
            <Checkbox 
              checked={selectAll} 
              onChange={onSelectAll}
              size="small"
              sx={{
                p: '4px', // Consistent checkbox padding
              }}
            />
          </TableCell>
        )}

        <TableCell sx={{ width: 100 }}>Quote </TableCell>
        <TableCell sx={{ width: 200 }}>Quote Title</TableCell>
        <TableCell sx={{ width: 180 }}>Client Name</TableCell>
        <TableCell sx={{ width: 120 }}>Issue Date</TableCell>
        <TableCell sx={{ width: 120 }}>Expiry Date</TableCell>
        <TableCell sx={{ width: 100 }}>Amount</TableCell>
        <TableCell sx={{ width: 100 }}>Status</TableCell>
        <TableCell sx={{ width: 100 }}>Action</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default QuoteTableHeader;