import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TextField, Grid, Alert, CircularProgress } from '@mui/material';
import vendorTimeTrackingService from '../services/vendorTimeTrackingService';
import PageHeader from '../../../components/common/PageHeader';
import PageLoader from '../../../components/common/Loader/PageLoader';
import TableSkeleton from '../../../components/common/Loader/TableSkeleton';

const statusColorMap = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

const TimeTrackingApproval = () => {
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [statusFilter, setStatusFilter] = useState('pending');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadEntries(1);
  }, [statusFilter]);

  const loadEntries = async (page) => {
    setLoading(true);
    setError('');
    try {
      const filters = {
        ...(statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {}),
        ...(employeeSearch.trim() ? { employee_search: employeeSearch.trim() } : {}),
        ...(dateFrom ? { date_from: dateFrom } : {}),
        ...(dateTo ? { date_to: dateTo } : {}),
      };
      const response = await vendorTimeTrackingService.getTimeEntries(page, 10, filters);
      const payload = response?.data ?? response ?? {};
      setEntries(payload.items || []);
      setPagination(
        payload.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (entryId) => {
    setActionLoading((prev) => ({ ...prev, [entryId]: 'approve' }));
    try {
      const response = await vendorTimeTrackingService.approveTimeEntry(entryId);
      const payload = response?.data ?? response ?? {};
      const approvedAt = payload.approved_at || new Date().toISOString();
      const approvedByName = payload.approved_by_name || 'Vendor User';

      setEntries((prev) => {
        const updated = prev.map((entry) => (
          entry.id === entryId
            ? {
              ...entry,
              status: 'approved',
              approved_at: approvedAt,
              approved_by_name: approvedByName,
              rejected_at: null,
              rejected_by_name: null,
            }
            : entry
        ));

        if (statusFilter === 'pending') {
          return updated.filter((entry) => entry.id !== entryId);
        }

        return updated;
      });

      setPagination((prev) => (
        statusFilter === 'pending'
          ? { ...prev, total: Math.max(0, (Number(prev?.total) || 0) - 1) }
          : prev
      ));
      setSuccessMessage('Entry approved successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [entryId]: null }));
    }
  };

  const handleReject = async (entryId) => {
    setActionLoading((prev) => ({ ...prev, [entryId]: 'reject' }));
    try {
      const response = await vendorTimeTrackingService.rejectTimeEntry(entryId);
      const payload = response?.data ?? response ?? {};
      const rejectedAt = payload.rejected_at || new Date().toISOString();
      const rejectedByName = payload.rejected_by_name || 'Vendor User';

      setEntries((prev) => {
        const updated = prev.map((entry) => (
          entry.id === entryId
            ? {
              ...entry,
              status: 'rejected',
              rejected_at: rejectedAt,
              rejected_by_name: rejectedByName,
              approved_at: null,
              approved_by_name: null,
            }
            : entry
        ));

        if (statusFilter === 'pending') {
          return updated.filter((entry) => entry.id !== entryId);
        }

        return updated;
      });

      setPagination((prev) => (
        statusFilter === 'pending'
          ? { ...prev, total: Math.max(0, (Number(prev?.total) || 0) - 1) }
          : prev
      ));
      setSuccessMessage('Entry rejected successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [entryId]: null }));
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${String(mins).padStart(2, '0')}m`;
  };

  const formatTime = (iso) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatAudit = (entry) => {
    if (entry.status === 'approved' && entry.approved_by_name) {
      return `${entry.approved_by_name} • ${formatDate(entry.approved_at)} ${formatTime(entry.approved_at)}`;
    }
    if (entry.status === 'rejected' && entry.rejected_by_name) {
      return `${entry.rejected_by_name} • ${formatDate(entry.rejected_at)} ${formatTime(entry.rejected_at)}`;
    }
    return '-';
  };

  const currentPage = Number(pagination?.current_page) || 1;
  const perPage = Number(pagination?.per_page) || 10;
  const total = Number(pagination?.total) || 0;
  const lastPage = Number(pagination?.last_page) || 1;
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = total === 0 ? 0 : Math.min(currentPage * perPage, total);

  return (
    <div className="min-h-full bg-gray-50">
      <PageHeader
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Time Tracking Approval', current: true },
        ]}
        title="Employee Time Tracking Approval"
      />

      <Box sx={{ px: 3 }}>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            fullWidth
            SelectProps={{
              native: true,
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label="Employee"
            placeholder="Name or email"
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            label="From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            label="To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={1} sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => loadEntries(1)} fullWidth>
            Apply
          </Button>
        </Grid>

        <Grid item xs={12} sm={1} sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setEmployeeSearch('');
              setDateFrom('');
              setDateTo('');
              setStatusFilter('all');
            }}
            fullWidth
          >
            Reset
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <TableSkeleton
          rows={5}
          columns={9}
          hasCheckbox={false}
        />
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Job</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Check-in</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Check-out</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hours</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Audit</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3, color: '#999' }}>
                      No time entries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>{formatDate(entry.check_in)}</TableCell>
                      <TableCell>
                        <Box>
                          <strong>{entry.employee_name}</strong>
                          <div style={{ fontSize: '0.85em', color: '#999' }}>{entry.employee_email}</div>
                        </Box>
                      </TableCell>
                      <TableCell>{entry.job_name || '-'}</TableCell>
                      <TableCell>{formatTime(entry.check_in)}</TableCell>
                      <TableCell>{formatTime(entry.check_out)}</TableCell>
                      <TableCell>{formatDuration(entry.total_time)}</TableCell>
                      <TableCell>
                        <Chip label={entry.status} color={statusColorMap[entry.status]} size="small" />
                      </TableCell>
                      <TableCell>{formatAudit(entry)}</TableCell>
                      <TableCell align="center">
                        {entry.status === 'pending' ? (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleApprove(entry.id)}
                              disabled={Boolean(actionLoading[entry.id])}
                              sx={{ minWidth: '80px' }}
                            >
                              {actionLoading[entry.id] === 'approve' ? <CircularProgress size={20} /> : 'Approve'}
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleReject(entry.id)}
                              disabled={Boolean(actionLoading[entry.id])}
                              sx={{ minWidth: '80px' }}
                            >
                              {actionLoading[entry.id] === 'reject' ? <CircularProgress size={20} /> : 'Reject'}
                            </Button>
                          </Box>
                        ) : (
                          <Chip label={entry.status === 'approved' ? '✓ Approved' : '✗ Rejected'} disabled size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              Showing {from}-{to} of {total} results
            </div>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'contained' : 'outlined'}
                  onClick={() => loadEntries(page)}
                  size="small"
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>
        </>
      )}
      </Box>
    </div>
  );
};

export default TimeTrackingApproval;
