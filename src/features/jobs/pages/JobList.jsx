// src/features/jobs/pages/JobList.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Fade } from '@mui/material';
import { Add } from '@mui/icons-material';
import { FileTextIcon } from 'lucide-react';
import JobTable from '../components/JobTable/JobTable';
import JobTableSkeleton from '../skeletons/JobTableSkeleton'; // Import the new skeleton
import PageHeader from '../../../components/common/PageHeader';
import ErrorAlert from '../../../components/feedback/ErrorAlert';
import HeaderSearch from '../../../components/common/HeaderSearch';
import CustomButton from '../../../components/common/CustomButton';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useJobs } from '../hooks/useJobs';
import { useToast } from '../../../components/common/ToastProvider';

const JobList = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const {
        jobs,
        loading,
        error,
        pagination,
        filters,
        handleSearch,
        handlePageChange: hookHandlePageChange,
        handleFilterChange,
        setPerPage,
        refresh,
        clearError,
        deleteJob,
    } = useJobs({ autoFetch: true });

    const [selectedJobs, setSelectedJobs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    // Track loading state for smooth transitions
    const [showInitialSkeleton, setShowInitialSkeleton] = useState(true);
    const [showRefreshSkeleton, setShowRefreshSkeleton] = useState(false);

    const searchDebounceRef = useRef(null);
    const isInitialMount = useRef(true);
    const refreshTimeoutRef = useRef(null);

    // Handle search input change with debounce
    const handleSearchChange = useCallback((value) => {
        setSearchInput(value);

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        searchDebounceRef.current = setTimeout(() => {
            setShowRefreshSkeleton(true);
            handleSearch(value);
            setSelectedJobs([]);
            setSelectAll(false);
        }, 500);
    }, [handleSearch]);

    // Handle page change
    const handlePageChange = useCallback((page) => {
        setShowRefreshSkeleton(true);
        hookHandlePageChange(null, page - 1);
        setSelectedJobs([]);
        setSelectAll(false);
    }, [hookHandlePageChange]);

    // Handle rows per page change
    const handleRowsPerPageChange = useCallback((event) => {
        const newPerPage = parseInt(event.target.value, 10);
        console.log('Changing rows per page to:', newPerPage);
        if (setPerPage) {
            setShowRefreshSkeleton(true);
            setPerPage(newPerPage);
            setSelectedJobs([]);
            setSelectAll(false);
        }
    }, [setPerPage]);

    // Handle select all
    const handleSelectAll = useCallback(() => {
        if (selectAll) {
            setSelectedJobs([]);
        } else {
            setSelectedJobs(jobs.map(job => job.id));
        }
        setSelectAll(!selectAll);
    }, [jobs, selectAll]);

    // Handle individual job selection
    const handleSelectJob = useCallback((jobId) => {
        setSelectedJobs(prev => {
            if (prev.includes(jobId)) {
                return prev.filter(id => id !== jobId);
            } else {
                return [...prev, jobId];
            }
        });
    }, []);

    // Handle delete job
    const handleDeleteClick = useCallback((job) => {
        setJobToDelete(job);
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = async () => {
        if (!jobToDelete) return;
        try {
            await deleteJob(jobToDelete.id);
            setDeleteDialogOpen(false);
            setJobToDelete(null);
            // useJobs handles the toast and refresh
        } catch (error) {
            console.error("Failed to delete job", error);
            // useJobs handles the error toast
            setDeleteDialogOpen(false);
            setJobToDelete(null);
        }
    };

    // Handle create job
    const handleCreateJob = useCallback(() => {
        alert("Feature is not yet implemented");
    }, []);

    // Handle create invoice for selected job
    const handleCreateInvoice = useCallback(() => {
        if (selectedJobs.length === 1) {
            const selectedJob = jobs.find(job => job.id === selectedJobs[0]);
            if (selectedJob) {
                navigate('/invoices/new', {
                    state: {
                        job: {
                            id: selectedJob.id,
                            number: selectedJob.job_number,
                            title: selectedJob.title,
                            client: selectedJob.client_name,
                            amount: selectedJob.total_amount,
                            currency: selectedJob.currency
                        }
                    }
                });
            }
        } else if (selectedJobs.length > 1) {
            showToast('Please select only one job to create an invoice.', 'warning');
        }
    }, [selectedJobs, jobs, navigate, showToast]);

    // Update selectAll when jobs or selectedJobs change
    useEffect(() => {
        if (jobs.length > 0 && selectedJobs.length === jobs.length && jobs.length > 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [jobs, selectedJobs]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    // Sync search input with filter value when it changes externally
    useEffect(() => {
        if (!isInitialMount.current && filters?.search !== undefined) {
            setSearchInput(filters.search || '');
        }
        isInitialMount.current = false;
    }, [filters?.search]);

    // Handle loading states
    useEffect(() => {
        if (loading) {
            if (jobs.length > 0) {
                setShowRefreshSkeleton(true);
            } else {
                setShowInitialSkeleton(true);
            }
        } else {
            refreshTimeoutRef.current = setTimeout(() => {
                setShowInitialSkeleton(false);
                setShowRefreshSkeleton(false);
            }, 300);
        }

        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, [loading, jobs.length]);

    return (
        <div className="min-h-full bg-gray-50">
            <PageHeader
                breadcrumb={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Jobs', current: true }
                ]}
                title="Jobs"
                subtitle="Manage and track all work orders in one place."
                actions={
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <HeaderSearch
                            value={searchInput}
                            onChange={handleSearchChange}
                            placeholder="Search jobs..."
                        />
                        {/* <CustomButton
                            label="Create Invoice"
                            onClick={handleCreateInvoice}
                            icon={FileTextIcon}
                            disabled={selectedJobs.length !== 1}
                            iconProps={{ size: 18 }}
                            sx={{ textTransform: 'none' }}
                        /> */}
                        <CustomButton
                            label="New Job"
                            disabled={true}
                            onClick={handleCreateJob}
                            icon={Add}
                            sx={{ textTransform: 'none' }}
                        />
                    </Box>
                }
            />

            {error && (
                <ErrorAlert
                    message={error}
                    onRetry={refresh}
                    onClose={clearError}
                    className="mb-6"
                />
            )}

            <div className="bg-white rounded-lg mt-6">
                {/* Initial load skeleton */}
                {showInitialSkeleton && (
                    <Fade in={showInitialSkeleton} timeout={300}>
                        <Box>
                            <JobTableSkeleton
                                rows={pagination?.perPage || 5}
                                showPagination={true}
                                totalItems={pagination?.totalItems || 25}
                                currentPage={1}
                                itemsPerPage={pagination?.perPage || 5}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />
                        </Box>
                    </Fade>
                )}

                {/* Main content */}
                {!showInitialSkeleton && (
                    <Box sx={{ position: 'relative' }}>
                        <JobTable
                            jobs={jobs}
                            selectedJobs={selectedJobs}
                            onSelectJob={handleSelectJob}
                            onSelectAll={handleSelectAll}
                            selectAll={selectAll}
                            onPageChange={handlePageChange}
                            currentPage={pagination?.currentPage || 1}
                            totalPages={pagination?.totalPages || 1}
                            totalItems={pagination?.totalItems || 0}
                            itemsPerPage={pagination?.perPage || 5}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            showPagination={true}
                            onDeleteClick={handleDeleteClick}
                        />

                        {/* Refresh skeleton overlay */}
                        {showRefreshSkeleton && (
                            <Fade in={showRefreshSkeleton} timeout={300}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'white',
                                        zIndex: 10,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <JobTableSkeleton
                                        rows={pagination?.perPage || 5}
                                        showPagination={true}
                                        totalItems={pagination?.totalItems || 25}
                                        currentPage={pagination?.currentPage || 1}
                                        itemsPerPage={pagination?.perPage || 5}
                                        onPageChange={handlePageChange}
                                        onRowsPerPageChange={handleRowsPerPageChange}
                                    />
                                </Box>
                            </Fade>
                        )}
                    </Box>
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                title={
                    jobToDelete?.status === 'scheduled' 
                        // && new Date(jobToDelete?.start_date || Date.now()) > new Date()
                        ? "Warning: Scheduled Job Deletion"
                        : "Delete Job"
                }
                message={
                    jobToDelete?.status === 'scheduled'
                        ? `This job is scheduled for ${jobToDelete.start_date || 'a future date'}. Deleting it will also remove it from the schedule. Are you sure?`
                        : "Are you sure you want to delete this job? This action cannot be undone."
                }
                severity={jobToDelete?.status === 'scheduled' ? "warning" : "error"}
                confirmText="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteDialogOpen(false);
                    setJobToDelete(null);
                }}
            />
        </div>
    );
};

export default JobList;