// src/features/jobs/components/JobTable/JobTableHeader.jsx
import React from 'react';
import { TableHead, TableRow, TableCell, Checkbox } from '@mui/material';

const JobTableHeader = ({ selectAll, onSelectAll }) => {
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
                    }
                }}
            >
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={selectAll}
                        onChange={onSelectAll}
                        size="small"
                    />
                </TableCell>
                <TableCell>Job Number / Title</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Tasks / Files</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
            </TableRow>
        </TableHead>
    );
};

export default JobTableHeader;