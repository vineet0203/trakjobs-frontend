// src/features/jobs/components/JobView/AttachmentsSection.jsx
import React, { useState } from 'react';
import {
    Paper,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    AttachFile,
    Description,
    Image,
    PictureAsPdf,
    TableChart,
    Slideshow,
    Code,
    Archive,
    Download,
    Visibility,
    Delete,
    MoreVert,
    InsertDriveFile,
    Close
} from '@mui/icons-material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import EllipsisText from '../../../../components/common/EllipsisText'; // Adjust the import path as needed

// Helper function to get icon based on file extension
const getFileIcon = (fileName, fileType) => {
    // Safe check for fileType
    if (fileType === 'image') return <Image fontSize="small" color="success" />;
    if (fileType === 'pdf') return <PictureAsPdf fontSize="small" color="error" />;
    if (fileType === 'document') return <Description fontSize="small" color="primary" />;
    if (fileType === 'spreadsheet') return <TableChart fontSize="small" color="success" />;
    if (fileType === 'archive') return <Archive fontSize="small" color="warning" />;

    const extension = fileName?.split('.').pop()?.toLowerCase() || '';

    switch (extension) {
        case 'pdf':
            return <PictureAsPdf fontSize="small" color="error" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'svg':
        case 'webp':
            return <Image fontSize="small" color="success" />;
        case 'doc':
        case 'docx':
            return <Description fontSize="small" color="primary" />;
        case 'xls':
        case 'xlsx':
        case 'csv':
            return <TableChart fontSize="small" color="success" />;
        case 'ppt':
        case 'pptx':
            return <Slideshow fontSize="small" color="warning" />;
        case 'zip':
        case 'rar':
        case '7z':
            return <Archive fontSize="small" color="warning" />;
        case 'js':
        case 'jsx':
        case 'ts':
        case 'html':
        case 'css':
        case 'json':
            return <Code fontSize="small" color="info" />;
        default:
            return <InsertDriveFile fontSize="small" color="action" />;
    }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const AttachmentsSection = ({
    attachments = [],
    onAddAttachment,
    onDownload,
    onPreview,
    onDelete
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const hasAttachments = attachments && attachments.length > 0;

    const handleMenuOpen = (event, attachment) => {
        setAnchorEl(event.currentTarget);
        setSelectedAttachment(attachment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        // Don't clear selected attachment immediately to allow menu actions
    };

    const handlePreview = () => {
        if (selectedAttachment) {
            setPreviewFile(selectedAttachment);
            setPreviewDialogOpen(true);
        }
        handleMenuClose();
        setSelectedAttachment(null);
    };

    const handleDownload = () => {
        if (selectedAttachment) {
            onDownload(selectedAttachment);
        }
        handleMenuClose();
        setSelectedAttachment(null);
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const confirmDelete = () => {
        if (selectedAttachment) {
            onDelete(selectedAttachment.id);
        }
        setDeleteDialogOpen(false);
        setSelectedAttachment(null);
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedAttachment(null);
    };

    // Safe check for previewable - with null check
    const isPreviewable = (attachment) => {
        if (!attachment) return false;
        const previewableTypes = ['image', 'pdf'];
        return previewableTypes.includes(attachment.file_type);
    };

    // Safe check for menu item visibility
    const showPreview = selectedAttachment && isPreviewable(selectedAttachment);

    return (
        <>
            <Paper sx={{
                p: 2.5,
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 400
            }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: hasAttachments ? 0.75 : 0,
                    px: 0.5
                }}>
                    <Box>
                        <SectionHeader number="4" title="Attachments" />
                        {hasAttachments && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {attachments.length} file{attachments.length > 1 ? 's' : ''}
                            </Typography>
                        )}
                    </Box>
                    
                    {/* Add button - Only visible when attachments exist */}
                    {hasAttachments && (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AttachFile />}
                            onClick={onAddAttachment}
                            sx={{ textTransform: 'none' }}
                        >
                            Add
                        </Button>
                    )}
                </Box>

                {/* Empty State - Shows when no attachments exist */}
                {!hasAttachments ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 4,
                            px: 2,
                            flex: 1,
                            minHeight: 300
                        }}
                    >
                        <AttachFile sx={{ fontSize: 48, color: 'grey.300', mb: 1.5 }} />
                        <Typography variant="body1" color="text.secondary" gutterBottom fontWeight={500}>
                            No attachments yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, textAlign: 'center', maxWidth: 250 }}>
                            Upload files, documents, or images related to this job
                        </Typography>
                        <Button
                            variant="contained"
                            size="medium"
                            startIcon={<AttachFile />}
                            onClick={onAddAttachment}
                            sx={{ textTransform: 'none' }}
                        >
                            Upload your first file
                        </Button>
                    </Box>
                ) : (
                    /* Attachments List - Shows when attachments exist */
                    <List sx={{
                        flex: 1,
                        mt: 0.5,
                        overflow: 'auto',
                        px: 0.5,
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
                        maxHeight: attachments.length > 4 ? '350px' : 'none',
                    }}>
                        {attachments.map((file, index) => (
                            <ListItem
                                key={file.id}
                                sx={{
                                    px: 1.5,
                                    py: 1,
                                    alignItems: 'center',
                                    borderBottom: index < attachments.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                        borderRadius: 1,
                                    }
                                }}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, file)}
                                    >
                                        <MoreVert fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    {getFileIcon(file.file_name, file.file_type)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <EllipsisText
                                                text={file.file_name}
                                                sx={{
                                                    fontWeight: 500,
                                                    maxWidth: '270px',
                                                    fontSize: '0.8rem',
                                                }}
                                            />
                                            <Chip
                                                label={file.extension?.toUpperCase() || 'FILE'}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    height: 18,
                                                    '& .MuiChip-label': {
                                                        fontSize: '0.65rem',
                                                        px: 0.8,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {file.uploaded_at}
                                            </Typography>
                                            {file.formatted_size && (
                                                <>
                                                    <Typography variant="caption" color="text.disabled">•</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {file.formatted_size}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Attachment Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {showPreview && (
                    <MenuItem onClick={handlePreview}>
                        <ListItemIcon>
                            <Visibility fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Preview</ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={handleDownload}>
                    <ListItemIcon>
                        <Download fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Delete fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Delete Attachment</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{selectedAttachment?.file_name || 'this file'}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog
                open={previewDialogOpen}
                onClose={() => setPreviewDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                {previewFile && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                                {previewFile.file_name}
                            </Typography>
                            <IconButton onClick={() => setPreviewDialogOpen(false)} size="small">
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            {previewFile.file_type === 'image' ? (
                                <Box sx={{ textAlign: 'center' }}>
                                    <img
                                        src={previewFile.url}
                                        alt={previewFile.file_name}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '70vh',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>
                            ) : previewFile.file_type === 'pdf' ? (
                                <iframe
                                    src={previewFile.url}
                                    style={{
                                        width: '100%',
                                        height: '70vh',
                                        border: 'none'
                                    }}
                                    title={previewFile.file_name}
                                />
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <InsertDriveFile sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                                    <Typography>Preview not available for this file type.</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Download />}
                                        onClick={() => window.open(previewFile.url, '_blank')}
                                        sx={{ mt: 2 }}
                                    >
                                        Download to View
                                    </Button>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button
                                startIcon={<Download />}
                                onClick={() => window.open(previewFile.url, '_blank')}
                            >
                                Download
                            </Button>
                            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default AttachmentsSection;