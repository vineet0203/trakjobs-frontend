// src/features/jobs/components/JobView/ActivitySection.jsx
import React, { useState } from 'react';
import {
    Paper,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Typography,
    Chip,
    IconButton,
    Divider,
    Collapse
} from '@mui/material';
import {
    Email,
    Send,
    ExpandMore,
    ExpandLess,
    AccessTime,
    AttachFile
} from '@mui/icons-material';
import SectionHeader from '../../../../components/common/form/SectionHeader';

// Simple email log data
const mockEmailLogs = [
    {
        id: 1,
        from: 'Amot Verma',
        fromEmail: 'amot.verma@trakjobs.com',
        to: 'John Smith',
        toEmail: 'john.smith@brightensolution.com',
        subject: 'Website Redesign - Initial Concepts',
        body: 'Hi John, attached are the initial design concepts for your review. Please let me know your thoughts.',
        sentAt: '2025-05-22T10:30:00',
        hasAttachment: true
    },
    {
        id: 2,
        from: 'Sarah Johnson',
        fromEmail: 'sarah.j@trakjobs.com',
        to: 'Sarah Johnson',
        toEmail: 'sarah.j@brightensolution.com',
        subject: 'Project Timeline Update',
        body: 'Hi Sarah, we\'ve updated the project timeline based on our last meeting. The new estimated completion date is June 15th.',
        sentAt: '2025-05-21T14:20:00',
        hasAttachment: true
    },
    {
        id: 3,
        from: 'Amot Verma',
        fromEmail: 'amot.verma@trakjobs.com',
        to: 'Mike Chen',
        toEmail: 'mike.chen@brightensolution.com',
        subject: 'Invoice #INV-2025-042',
        body: 'Dear Mike, please find attached the invoice for the completed milestone. Let me know if you have any questions.',
        sentAt: '2025-05-20T09:15:00',
        hasAttachment: true
    },
    {
        id: 4,
        from: 'David Wilson',
        fromEmail: 'david.w@trakjobs.com',
        to: 'David Wilson',
        toEmail: 'david.w@brightensolution.com',
        subject: 'Meeting Confirmation',
        body: 'Hi David, confirming our meeting tomorrow at 2 PM EST to discuss the SEO strategy.',
        sentAt: '2025-05-19T16:45:00',
        hasAttachment: false
    },
    {
        id: 5,
        from: 'Amot Verma',
        fromEmail: 'amot.verma@trakjobs.com',
        to: 'Client',
        toEmail: 'client@brightensolution.com',
        subject: 'Additional Resources',
        body: 'Here are some additional resources for the project.',
        sentAt: '2025-05-18T11:20:00',
        hasAttachment: true
    }
];

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ActivitySection = () => {
    const [emailLogs] = useState(mockEmailLogs);
    const [expanded, setExpanded] = useState(true);
    const [expandedEmail, setExpandedEmail] = useState(null);

    const handleEmailClick = (id) => {
        setExpandedEmail(expandedEmail === id ? null : id);
    };

    const hasEmails = emailLogs.length > 0;

    return (
        <Paper
            sx={{
                p: 2.5,
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {/* Header - Fixed at top */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SectionHeader number="4" title="Activity" />
                </Box>
            </Box>

            <Collapse
                in={expanded}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                    overflow: 'hidden',

                    '& .MuiCollapse-wrapper': {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                    },
                    '& .MuiCollapse-wrapperInner': {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                    },
                }}
            >
                {!hasEmails ? (
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Email sx={{ fontSize: 48, color: 'grey.300', mb: 1.5 }} />
                        <Typography variant="body1" color="text.secondary">
                            No emails sent yet
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        pr: 1,
                        // Exact same scrollbar styling as AttachmentsSection
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#c1c1c1',
                            borderRadius: '10px',
                            '&:hover': {
                                background: '#a8a8a8',
                            },
                        },
                        maxHeight: emailLogs.length > 4 ? '350px' : 'none',
                    }}>
                        {emailLogs.map((email) => (
                            <Box key={email.id} sx={{ mb: 1.5 }}>
                                {/* Email Summary Card */}
                                <ListItem
                                    sx={{
                                        px: 1.5,
                                        py: 1,
                                        alignItems: 'flex-start',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        bgcolor: expandedEmail === email.id ? 'action.hover' : 'background.paper',
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                            borderColor: 'primary.light'
                                        },
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleEmailClick(email.id)}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                                            <Send sx={{ fontSize: 16 }} />
                                        </Avatar>
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    To: {email.to}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {email.subject}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <AccessTime sx={{ fontSize: 10, color: 'text.disabled' }} />
                                                        <Typography variant="caption" color="text.disabled">
                                                            {formatTimestamp(email.sentAt)}
                                                        </Typography>
                                                    </Box>
                                                    {email.hasAttachment && (
                                                        <>
                                                            <Typography variant="caption" color="text.disabled">•</Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <AttachFile sx={{ fontSize: 10, color: 'text.disabled' }} />
                                                                <Typography variant="caption" color="text.disabled">
                                                                    Attachment
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )}
                                                </Box>
                                            </Box>
                                        }
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />

                                    <IconButton size="small" sx={{ alignSelf: 'center' }}>
                                        {expandedEmail === email.id ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </ListItem>

                                {/* Expanded Email Content */}
                                <Collapse in={expandedEmail === email.id} timeout="auto" unmountOnExit>
                                    <Box sx={{
                                        pl: 7,
                                        pr: 2,
                                        pb: 2,
                                        pt: 1,
                                        bgcolor: 'grey.50',
                                        borderRadius: 2,
                                        mx: 1.5,
                                        mt: 1,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>From:</strong> {email.from} &lt;{email.fromEmail}&gt;
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>To:</strong> {email.to} &lt;{email.toEmail}&gt;
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            <strong>Subject:</strong> {email.subject}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                                            {email.body}
                                        </Typography>
                                        {email.hasAttachment && (
                                            <Chip
                                                icon={<AttachFile />}
                                                label="Has attachments"
                                                size="small"
                                                variant="outlined"
                                                sx={{ mt: 2 }}
                                            />
                                        )}
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                                            Sent: {new Date(email.sentAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Collapse>
                            </Box>
                        ))}
                    </Box>
                )}
            </Collapse>
        </Paper>
    );
};

export default ActivitySection;