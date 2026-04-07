// features/quotes/pages/QuoteList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuotesTable from '../components/QuoteTable/QuotesTable';
import PageHeader from '../../../components/common/PageHeader';
import CustomButton from '../../../components/common/CustomButton';
import HeaderSearch from '../../../components/common/HeaderSearch';
import TableSkeleton from '../../../components/common/Loader/TableSkeleton'; // Import the skeleton
import { Plus, BriefcaseBusiness } from 'lucide-react';
import { useQuotes } from '../hooks/useQuotes';
import { useToast } from '../../../components/common/ToastProvider';
import quoteService from '../services/quoteService';
import QuotePreviewModal from '../components/QuotePreviewModal';

const QuoteList = () => {
    const navigate = useNavigate();
    const [selectedQuotes, setSelectedQuotes] = useState([]);
    const [converting, setConverting] = useState(false);
    const [previewQuote, setPreviewQuote] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const { showToast } = useToast();

    // Use the custom hook
    const {
        quotes,
        loading,
        error,
        pagination,
        filters,
        handleSearch,
        handlePageChange,
        handleSort,
        deleteQuote,
        refresh,
        clearError
    } = useQuotes({ limit: 5, autoFetch: true });

    // Handle error display
    useEffect(() => {
        if (error) {
            // Auto-clear error after 5 seconds
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleEdit = (quoteId) => {
        navigate(`/quotes/${quoteId}/edit`);
    };

    const handleDelete = async (quoteId) => {
        if (window.confirm('Are you sure you want to delete this quote?')) {
            try {
                await deleteQuote(quoteId);
                // Refresh the list after deletion
                refresh();
            } catch (err) {
                console.error('Failed to delete quote:', err);
            }
        }
    };

    const handleView = (quoteId) => {
        const quote = quotes.find((item) => item.id === quoteId);
        if (!quote) return;
        setPreviewQuote(quote);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        setPreviewQuote(null);
    };

    const handleAddQuote = () => {
        navigate('/quotes/new');
    };

    const handleConvertToJob = async () => {
        if (selectedQuotes.length === 0) return;

        const quoteId = selectedQuotes[0];
        const quote = quotes.find(q => q.id === quoteId);

        if (!quote) return;

        if (quote.approval_status !== 'accepted' && quote.status !== 'accepted') {
            showToast('Only accepted quotes can be converted to jobs.', 'error');
            return;
        }

        setConverting(true);
        try {
            const response = await quoteService.convertQuoteToJob(quoteId);
            const jobId = response?.data?.job?.id;
            showToast('Quote successfully converted to job.', 'success');
            if (jobId) {
                navigate(`/jobs/${jobId}`);
            }
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to convert quote to job.';
            showToast(message, 'error');
        } finally {
            setConverting(false);
        }
    };

    const handleRowsPerPageChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        console.log('Change rows per page to:', newLimit);
    };

    // Transform pagination to match table expectations
    const tablePagination = {
        page: pagination.currentPage - 1,
        rowsPerPage: pagination.perPage,
        total: pagination.totalItems,
        onPageChange: handlePageChange,
        onRowsPerPageChange: handleRowsPerPageChange
    };

    return (
        <div className="min-h-full bg-gray-50">
            <PageHeader
                breadcrumb={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Quotes', current: true }
                ]}
                title="Quotes"
                subtitle="Manage and track all your quotes"
                actions={
                    <>
                        <HeaderSearch
                            value={filters.search || ''}
                            onChange={handleSearch}
                            placeholder="Search quotes..."
                        />
                        <CustomButton
                            label="Convert to Job"
                            onClick={handleConvertToJob}
                            icon={BriefcaseBusiness}
                            disabled={selectedQuotes.length === 0}
                            loading={converting}
                            variant="outlined"
                        />
                        <CustomButton
                            label="New Quote"
                            onClick={handleAddQuote}
                            icon={Plus}
                        />
                    </>
                }
            />

            {/* Simple Error Alert */}
            {error && (
                <div className="mt-4 mx-4">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={clearError}
                                    className="inline-flex text-red-400 focus:outline-none"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg mt-6">
                {loading && quotes.length === 0 ? (
                    <TableSkeleton
                        rows={6}
                        columns={7}
                        hasCheckbox={true}
                    />
                ) : (
                    <QuotesTable
                        data={quotes}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                        onSelect={setSelectedQuotes}
                        selectedQuotes={selectedQuotes}
                        pagination={tablePagination}
                        onSort={handleSort}
                        sortField={filters.sortField}
                        sortDirection={filters.sortDirection}
                    />
                )}
            </div>

            <QuotePreviewModal
                open={previewOpen}
                quote={previewQuote}
                onClose={handleClosePreview}
                onEdit={(quoteId) => {
                    handleClosePreview();
                    handleEdit(quoteId);
                }}
            />
        </div>
    );
};

export default QuoteList;