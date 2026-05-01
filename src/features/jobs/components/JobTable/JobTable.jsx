// src/features/jobs/components/JobTable/JobTable.jsx
import React from 'react';
import { Paper, Table, TableBody, TableCell, TableRow, Box } from '@mui/material';
import JobTableHeader from './JobTableHeader';
import JobTableRow from './JobTableRow';
import JobTablePagination from './JobTablePagination';

const JobTable = ({
    jobs = [],
    selectedJobs = [],
    onSelectJob,
    onSelectAll,
    selectAll,
    onPageChange,
    onRowsPerPageChange,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 5,
    showPagination = false,
    onDeleteClick
}) => {
    const pageIndex = currentPage - 1;

    const handlePageChange = (event, newPage) => {
        if (onPageChange) {
            onPageChange(newPage + 1);
        }
    };

    const handleRowsPerPageChange = (event) => {
        if (onRowsPerPageChange) {
            onRowsPerPageChange(event);
        }
    };

    // Calculate empty rows to fill the page
    const emptyRows = itemsPerPage - jobs.length;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: '#e5e7eb',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    backgroundColor: '#fff',
                }}
            >
                <Table>
                    <JobTableHeader selectAll={selectAll} onSelectAll={onSelectAll} />

                    <TableBody>
                        {jobs.map((job) => (
                            <JobTableRow
                                key={job.id}
                                job={job}
                                isSelected={selectedJobs.includes(job.id)}
                                onSelect={onSelectJob}
                                onDeleteClick={onDeleteClick}
                            />
                        ))}

                        {/* Add invisible empty rows to maintain consistent height */}
                        {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
                            <TableRow
                                key={`empty-${index}`}
                                sx={{
                                    height: '73px',
                                    '& .MuiTableCell-root': {
                                        py: '16px',
                                        borderBottom: 'none', // Remove all borders
                                        opacity: 0, // Make content invisible (if any)
                                    },
                                    '&:hover': {
                                        backgroundColor: 'transparent', // No hover effect
                                    }
                                }}
                            >
                                <TableCell padding="checkbox" />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                            </TableRow>
                        ))}

                        {/* Show "No jobs found" only when there are absolutely no jobs */}
                        {jobs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4, height: '73px' }}>
                                    No jobs found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {showPagination && (
                    <JobTablePagination
                        count={totalItems}
                        page={pageIndex}
                        rowsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default JobTable;