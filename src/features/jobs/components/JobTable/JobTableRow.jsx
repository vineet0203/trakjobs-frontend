// src/features/jobs/components/JobTable/JobTableRow.jsx
import React from 'react';
import { TableRow, TableCell, Checkbox, Typography, Box, Chip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import EllipsisText from '../../../../components/common/EllipsisText';
import ProfileAvatar from '../../../../components/common/avatar/ProfileAvatar';
import { Business, Person, Description, AttachFile, Assignment, Delete } from '@mui/icons-material';
import { BriefcaseBusiness, Home, Calendar, Clock, DollarSign } from 'lucide-react';

// Helper function to get priority chip color
const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'high':
        case 'urgent':
            return { bgcolor: '#ffebee', color: '#d32f2f' };
        case 'medium':
            return { bgcolor: '#fff4e5', color: '#ed6c02' };
        case 'low':
            return { bgcolor: '#e8f5e9', color: '#2e7d32' };
        default:
            return { bgcolor: '#f5f5f5', color: '#616161' };
    }
};

// Helper function to get status chip color
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return { bgcolor: '#e8f5e9', color: '#2e7d32' };
        case 'in_progress':
        case 'scheduled':
            return { bgcolor: '#e3f2fd', color: '#1976d2' };
        case 'pending':
            return { bgcolor: '#fff4e5', color: '#ed6c02' };
        case 'cancelled':
        case 'archived':
            return { bgcolor: '#ffebee', color: '#d32f2f' };
        case 'on_hold':
            return { bgcolor: '#f3e5f5', color: '#7b1fa2' };
        default:
            return { bgcolor: '#f5f5f5', color: '#616161' };
    }
};

// Helper function to format work type
const formatWorkType = (type) => {
    if (!type) return 'N/A';
    return type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Helper function to get client display name
const getClientDisplayName = (client) => {
    if (!client) return 'N/A';
    return client.name || 'Unnamed Client';
};

const JobTableRow = ({ job, isSelected, onSelect, onDeleteClick }) => {
    const clientName = getClientDisplayName(job.client);
    const clientType = job.client?.client_type || 'commercial';
    const jobNumber = job.job_number || 'N/A';
    const title = job.title || 'Untitled Job';
    const status = job.status || 'pending';
    const totalAmount = job.total_amount || 0;
    const formattedTotal = job.formatted_total || `$${totalAmount.toFixed(2)}`;
    const assignedTo = job.assigned_to;
    const latestAssignment = job.latest_assignment;
    const taskCount = job.stats?.total_tasks || 0;
    const attachmentCount = job.stats?.total_attachments || 0;

    return (
        <TableRow
            hover
            selected={isSelected}
            sx={{
                height: '73px', // Match skeleton row height
                '& .MuiTableCell-root': {
                    py: '16px', // Match skeleton padding
                }
            }}
        >
            <TableCell padding="checkbox" >
                <Checkbox size="small" checked={isSelected} onChange={() => onSelect(job.id)} />
            </TableCell>

            {/* Job Number & Title Column */}
            <TableCell>
                <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment
                            sx={{
                                fontSize: 20,
                                color: clientType === 'commercial'
                                    ? 'primary.main'
                                    : 'warning.main',
                            }}
                        />
                        <Box sx={{ minWidth: 0 }}> {/* Add minWidth:0 for proper text truncation */}
                            <EllipsisText
                                text={jobNumber}
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '0.9rem',
                                    maxWidth: 180 // Adjust based on your needs
                                }}
                            />
                            <EllipsisText
                                text={title}
                                sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    maxWidth: 180 // Adjust based on your needs
                                }}
                            />
                        </Box>
                    </Box>
                </Link>
            </TableCell>

            {/* Client Column */}
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {clientType === 'commercial' ? (
                        <BriefcaseBusiness size={18} color="#1976d2" />
                    ) : (
                        <Home size={18} color="#ed6c02" />
                    )}
                    <Box sx={{ minWidth: 0 }}> {/* Add minWidth:0 for proper text truncation */}
                        <EllipsisText
                            text={clientName}
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                maxWidth: 150 // Adjust based on your needs
                            }}
                        />
                        {/* <EllipsisText
                            text={clientType.toUpperCase()}
                            sx={{
                                fontSize: '0.7rem',
                                color: 'text.secondary',
                                maxWidth: 150 // Adjust based on your needs
                            }}
                        /> */}
                    </Box>
                </Box>
            </TableCell>

            {/* Priority & Status Column */}
            <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Chip
                        label={status.replace('_', ' ')}
                        size="small"
                        sx={{
                            ...getStatusColor(status),
                            height: 20,
                            width: 'fit-content',
                            '& .MuiChip-label': {
                                fontSize: '0.7rem',
                                px: 0.8,
                                fontWeight: 500,
                                textTransform: 'capitalize',
                                maxWidth: 80,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            },
                        }}
                    />
                </Box>
            </TableCell>

            {/* Assigned To Column */}
            <TableCell>
                {latestAssignment ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ProfileAvatar
                            name={latestAssignment.employee_name}
                            size={24}
                        />
                        <EllipsisText
                            text={latestAssignment.employee_name}
                            sx={{ fontSize: '0.85rem', maxWidth: 120 }}
                        />
                    </Box>
                ) : assignedTo ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ProfileAvatar
                            name={assignedTo.full_name || 'Unknown User'}
                            size={24}
                        />
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.disabled">Unassigned</Typography>
                )}
            </TableCell>

            {/* Tasks & Attachments Column */}
            <TableCell>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Description fontSize="small" color="action" sx={{ fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                            {taskCount}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AttachFile fontSize="small" color="action" sx={{ fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                            {attachmentCount}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>

            {/* Amount Column */}
            <TableCell align="right">
                <EllipsisText
                    text={formattedTotal}
                    sx={{
                        fontWeight: 600,
                        color: '#2e7d32',
                        maxWidth: 100 // Adjust based on your needs
                    }}
                />
            </TableCell>

            {/* Actions Column */}
            <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                <IconButton 
                    size="small" 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteClick && onDeleteClick(job);
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Delete fontSize="small" />
                </IconButton>
            </TableCell>

            {/* Start Date Column - Uncomment if you want to show it */}
            {/* <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={14} color="#757575" />
                    <EllipsisText
                        text={startDate}
                        sx={{ 
                            fontSize: '0.8rem',
                            maxWidth: 100
                        }}
                    />
                </Box>
            </TableCell> */}
        </TableRow>
    );
};

export default JobTableRow;