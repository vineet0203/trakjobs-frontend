import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItemButton,
  ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import PageHeader from '../../components/common/PageHeader';
import PageLoader from '../../components/common/Loader/PageLoader';
import InvoicePreview from './InvoicePreview';
import employeeService from '../../features/employees/services/employeeService';
import jobService from '../../features/jobs/services/jobService';
import invoiceService from './services/invoiceService';
import { mapJobToInvoiceRow } from './utils/invoiceMappers';
import { useToast } from '../../components/common/ToastProvider';

const toIsoDate = (date) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().split('T')[0];
};

const addDays = (dateString, days) => {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return '';
  parsed.setDate(parsed.getDate() + days);
  return parsed.toISOString().split('T')[0];
};

const MetricCard = ({ title, value, color, icon, subtitle }) => (
  <Paper sx={{
    p: 2.5, borderRadius: 2.5, border: '1px solid #e8edf5',
    display: 'flex', alignItems: 'flex-start', gap: 2,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', bgcolor: '#fff',
    transition: 'box-shadow 0.2s, transform 0.2s',
    '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.10)', transform: 'translateY(-2px)' }
  }}>
    <Box sx={{ color, bgcolor: `${color}18`, p: 1.4, borderRadius: 2.5, display: 'flex', flexShrink: 0 }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ color: '#0f172a', fontSize: 24, fontWeight: 800, lineHeight: 1.1, mb: 0.3 }}>
        {value}
      </Typography>
      {subtitle && <Typography sx={{ color: '#94a3b8', fontSize: 11 }}>{subtitle}</Typography>}
    </Box>
  </Paper>
);

const InvoiceList = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Tabs State
  const [currentTab, setCurrentTab] = useState(0);

  // Layout & Existing State
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [employeeSearch, setEmployeeSearch] = useState('');

  const [jobs, setJobs] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [creatingInvoiceId, setCreatingInvoiceId] = useState(null);
  const [previewInvoiceId, setPreviewInvoiceId] = useState(null);

  // Job Filters
  const [jobFromDate, setJobFromDate] = useState('');
  const [jobToDate, setJobToDate] = useState('');
  const [appliedJobFromDate, setAppliedJobFromDate] = useState('');
  const [appliedJobToDate, setAppliedJobToDate] = useState('');
  const [jobStatus, setJobStatus] = useState('all');

  const [jobPage, setJobPage] = useState(0);
  const [jobRowsPerPage, setJobRowsPerPage] = useState(10);

  // History State
  const [invoices, setInvoices] = useState([]);
  const [invoicesTotal, setInvoicesTotal] = useState(0);
  const [historySearch, setHistorySearch] = useState('');
  const [historyEmpId, setHistoryEmpId] = useState('all');
  const [historyStatus, setHistoryStatus] = useState('all');
  const [historyFromDate, setHistoryFromDate] = useState('');
  const [historyToDate, setHistoryToDate] = useState('');
  const [appliedHistoryFromDate, setAppliedHistoryFromDate] = useState('');
  const [appliedHistoryToDate, setAppliedHistoryToDate] = useState('');

  const [historyPage, setHistoryPage] = useState(0);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const response = await employeeService.getAll({ per_page: 100, page: 1 });
        const data = Array.isArray(response?.data) ? response.data : [];
        const mapped = data.map((emp) => ({
          id: emp.id,
          name: emp.full_name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || `Employee ${emp.id}`,
          avatar: emp.profile_photo || '',
          jobCount: emp.jobs_count || 0
        }));
        setEmployees(mapped);
        if (mapped.length > 0) {
          setSelectedEmpId(mapped[0].id);
        }
      } catch (error) {
        showToast('Failed to load employees for invoice generation.', 'error');
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, [showToast]);

  useEffect(() => {
    const fetchJobsForEmployee = async () => {
      if (!selectedEmpId) {
        setJobs([]);
        return;
      }
      try {
        setLoadingJobs(true);
        const response = await jobService.getAll({ per_page: 100, page: 1 });
        const data = Array.isArray(response?.data) ? response.data : [];
        const filtered = data.filter((job) => {
          const latestEmployeeId = Number(job?.latest_assignment?.employee_id || 0);
          return latestEmployeeId === Number(selectedEmpId);
        });
        setJobs(filtered);
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === Number(selectedEmpId)
              ? { ...emp, jobCount: filtered.length }
              : emp
          )
        );
      } catch (error) {
        showToast('Failed to load jobs for selected employee.', 'error');
        setJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobsForEmployee();
  }, [selectedEmpId, showToast]);

  const loadHistory = async () => {
    try {
      const params = {
        page: historyPage + 1,
        per_page: historyRowsPerPage,
      };
      if (historyEmpId !== 'all') params.employee_id = historyEmpId;
      if (historyStatus !== 'all') params.status = historyStatus;
      if (appliedHistoryFromDate) params.date_from = appliedHistoryFromDate;
      if (appliedHistoryToDate) params.date_to = appliedHistoryToDate;

      const response = await invoiceService.getAll(params);
      setInvoices(response?.data || []);
      setInvoicesTotal(response?.meta?.total || response?.data?.length || 0);
    } catch (error) {
      showToast('Failed to load invoice history', 'error');
    }
  };

  useEffect(() => {
    if (currentTab === 1) {
      loadHistory();
    }
  }, [currentTab, historyPage, historyRowsPerPage, historyEmpId, historyStatus, appliedHistoryFromDate, appliedHistoryToDate]);

  const handleGenerateInvoice = async (jobRecord) => {
    if (!selectedEmpId) {
      showToast('Please select an employee before generating invoice.', 'error');
      return;
    }
    const billDate = toIsoDate(new Date());
    const deliveryDate = billDate;
    const paymentDeadline = addDays(billDate, 15);
    const billingClient = jobRecord.rawJob?.client || {};

    const payload = {
      employee_id: selectedEmpId,
      client_id: billingClient.id || null,
      bill_date: billDate,
      delivery_date: deliveryDate,
      payment_deadline: paymentDeadline,
      mileage: 0,
      other_expense: 0,
      vat: 0,
      note: '',
      terms_conditions: '',
      billing_address: {
        name: billingClient.name || '-',
        street: '-',
        contact: [billingClient.contact_phone, billingClient.contact_email].filter(Boolean).join(' | ') || '-',
      },
      status: 'draft',
      items: [mapJobToInvoiceRow(jobRecord.rawJob)],
    };

    try {
      setCreatingInvoiceId(jobRecord.id);
      const created = await invoiceService.create(payload);
      setPreviewInvoiceId(created.id);
      showToast('Invoice generated successfully.', 'success');
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to generate invoice.', 'error');
    } finally {
      setCreatingInvoiceId(null);
    }
  };

  if (previewInvoiceId) {
    return (
      <InvoicePreview
        onBackToList={() => setPreviewInvoiceId(null)}
        invoiceId={previewInvoiceId}
      />
    );
  }

  // Show page loader during initial data load
  if (loadingEmployees) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fb' }}>
        <PageHeader
          breadcrumb={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Invoices', current: true },
          ]}
          title="Invoices"
        />
        <PageLoader message="Loading invoices..." size="lg" />
      </Box>
    );
  }

  // Derived computations
  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(employeeSearch.toLowerCase())
  );
  const selectedEmpName = employees.find(e => e.id === selectedEmpId)?.name || '';

  let filteredJobs = jobs.filter(j => {
    if (jobStatus !== 'all' && j.status?.toLowerCase() !== jobStatus.toLowerCase()) return false;
    const jobDateStr = j.start_date || j.issue_date || '';
    if (appliedJobFromDate && jobDateStr < appliedJobFromDate) return false;
    if (appliedJobToDate && jobDateStr > appliedJobToDate) return false;
    return true;
  });

  const jobCards = filteredJobs
    .slice(jobPage * jobRowsPerPage, jobPage * jobRowsPerPage + jobRowsPerPage)
    .map((job) => ({
      id: job.id,
      jobId: job.job_number ? `#${job.job_number}` : `#${job.id}`,
      jobName: job.title || '-',
      date: job.start_date || job.issue_date || '-',
      rate: Number(job.total_amount || 0),
      rawJob: job,
    }));

  const getStatusChipSx = (status) => {
  const map = {
    scheduled: { color: '#2563eb', bg: '#eff6ff' },
    pending: { color: '#d97706', bg: '#fffbeb' },
    completed: { color: '#16a34a', bg: '#f0fdf4' },
    paid: { color: '#16a34a', bg: '#f0fdf4' },
    cancelled: { color: '#dc2626', bg: '#fef2f2' },
    draft: { color: '#64748b', bg: '#f8fafc' },
    sent: { color: '#2563eb', bg: '#eff6ff' },
    overdue: { color: '#ea580c', bg: '#fff7ed' },
  };
  return map[status?.toLowerCase()] || { color: '#64748b', bg: '#f8fafc' };
};

  const getMetrics = () => {
    const totalJobs = jobs.length;
    const pendingInv = invoices.filter(i => i.status === 'draft' || i.status === 'sent').length;
    const genThisMonth = invoices.length;
    const totalAmt = invoices.reduce((acc, curr) => acc + Number(curr.totals?.grand_total || 0), 0);
    return { totalJobs, pendingInv, genThisMonth, totalAmt };
  };

  const metrics = getMetrics();

  const handleSendAction = async (id) => {
    try {
      await invoiceService.send(id, { email: '' });
      showToast('Invoice sent successfully.', 'success');
      loadHistory();
    } catch (e) {
      showToast('Failed to send invoice.', 'error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fb', pb: 5 }}>
      <PageHeader
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Invoices', current: true },
        ]}
        title="Invoices"
      />

      <Box sx={{ px: { xs: 2, md: 4 }, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <MetricCard title="Total Jobs" value={metrics.totalJobs} color="#2563eb" icon={<WorkOutlineIcon />} subtitle="Assigned to employees" />
          <MetricCard title="Pending Invoices" value={metrics.pendingInv} color="#f59e0b" icon={<PendingActionsIcon />} subtitle="Draft & sent" />
          <MetricCard title="This Month" value={metrics.genThisMonth} color="#8b5cf6" icon={<ShowChartIcon />} subtitle="Invoices generated" />
          <MetricCard title="Total Amount" value={`${metrics.totalAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} color="#10b981" icon={<AttachMoneyIcon />} subtitle="Across all invoices" />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, v) => setCurrentTab(v)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: 14, color: '#64748b', minHeight: 40 },
              '& .Mui-selected': { color: '#1e40af !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#2563eb', height: 3, borderRadius: '3px 3px 0 0' }
            }}
          >
            <Tab label="Generate Invoice" icon={<ReceiptIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
            <Tab label="Invoice History" icon={<ShowChartIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'stretch', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            {/* LEFT PANEL */}
            <Paper elevation={0} sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0, borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Employees
                  </Typography>
                  <Chip label={filteredEmployees.length} size="small" sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: '#eff6ff', color: '#2563eb' }} />
                </Box>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search employees..."
                  value={employeeSearch}
                  onChange={e => setEmployeeSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
              <List sx={{ p: 0, maxHeight: 600, overflowY: 'auto' }}>
                {filteredEmployees.map((emp) => {
                  const isSelected = emp.id === selectedEmpId;
                  return (
                    <ListItemButton
                      key={emp.id}
                      onClick={() => setSelectedEmpId(emp.id)}
                      sx={{
                        px: 2,
                        py: 1.5,
                        bgcolor: isSelected ? '#dbeafe' : 'transparent',
                        borderBottom: '1px solid #f1f5f9',
                        '&:hover': { bgcolor: '#f0f4ff' },
                      }}
                    >
                      <Avatar src={emp.avatar} sx={{ width: 40, height: 40, mr: 2, bgcolor: isSelected ? '#ffffff20' : '#e2e8f0', color: '#64748b' }}>
                        {emp.name.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={emp.name}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isSelected ? '#1d4ed8' : '#1e293b'
                        }}
                      />
                      <Chip
                        label={`${emp.jobCount || 0} Jobs`}
                        size="small"
                        sx={{
                          bgcolor: '#eff6ff',
                          color: '#1e40af',
                          fontWeight: 600,
                          fontSize: 12,
                          height: 24
                        }}
                      />
                    </ListItemButton>
                  );
                })}
                {filteredEmployees.length === 0 && (
                  <Box sx={{ p: 3, textAlign: 'center', color: '#64748b' }}>
                    No employees found
                  </Box>
                )}
              </List>
            </Paper>

            {/* RIGHT PANEL */}
            <Paper elevation={0} sx={{ width: { xs: '100%', md: 'calc(100% - 324px)' }, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', bgcolor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>
                  {selectedEmpName ? `${selectedEmpName} · ${filteredJobs.length} Jobs` : 'Select an employee'}
                </Typography>

                <Stack direction="row" spacing={2}>
                  <TextField
                    type="date"
                    size="small"
                    label="From"
                    name="jobFilterFrom"
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
                    value={jobFromDate}
                    onChange={e => setJobFromDate(e.target.value)}
                    sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <TextField
                    type="date"
                    size="small"
                    label="To"
                    name="jobFilterTo"
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
                    value={jobToDate}
                    onChange={e => setJobToDate(e.target.value)}
                    sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <FormControl size="small" sx={{ width: 140 }}>
                    <Select value={jobStatus} onChange={e => setJobStatus(e.target.value)} sx={{ borderRadius: 2 }}>
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => {
                      setAppliedJobFromDate(jobFromDate);
                      setAppliedJobToDate(jobToDate);
                    }}
                    sx={{ borderRadius: 2, px: 2, textTransform: 'none' }}
                  >
                    Apply
                  </Button>
                  {(appliedJobFromDate || appliedJobToDate || jobFromDate || jobToDate || jobStatus !== 'all') && (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => {
                        setJobFromDate('');
                        setJobToDate('');
                        setAppliedJobFromDate('');
                        setAppliedJobToDate('');
                        setJobStatus('all');
                      }}
                      sx={{ borderRadius: 2, minWidth: 'auto', px: 1, color: '#64748b', borderColor: '#cbd5e1' }}
                    >
                      Clear
                    </Button>
                  )}
                </Stack>
              </Box>

              <TableContainer sx={{ flexGrow: 1 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Job ID</TableCell>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Job Name</TableCell>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Client Name</TableCell>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }} align="right">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ '& tr:hover': { bgcolor: '#f8fafc' } }}>
                    {!selectedEmpId ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ py: 8, textAlign: 'center', color: '#94a3b8' }}>
                          <Typography>Select an employee to view jobs</Typography>
                        </TableCell>
                      </TableRow>
                    ) : jobCards.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ py: 8, textAlign: 'center', color: '#94a3b8' }}>
                          <Typography>No jobs found for selected criteria</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobCards.map((job) => (
                        <TableRow key={job.id} sx={{ borderBottom: '1px solid #f1f5f9' }}>
                          <TableCell sx={{ fontWeight: 500 }}>{job.jobId}</TableCell>
                          <TableCell>{job.jobName}</TableCell>
                          <TableCell>{job.rawJob?.client?.name || '-'}</TableCell>
                          <TableCell>{job.date}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>${job.rate.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip label={job.rawJob?.status || 'active'} size="small" sx={{ bgcolor: getStatusChipSx(job.rawJob?.status).bg, color: getStatusChipSx(job.rawJob?.status).color, fontWeight: 700, fontSize: 11, height: 22, textTransform: 'capitalize', border: `1px solid ${getStatusChipSx(job.rawJob?.status).color}30`, '& .MuiChip-label': { px: 1.2 } }} />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleGenerateInvoice(job)}
                              startIcon={<ReceiptIcon />}
                              disabled={creatingInvoiceId === job.id}
                              sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                borderColor: '#2563eb',
                                color: '#2563eb',
                                fontWeight: 600,
                                fontSize: 12,
                                '&:hover': { borderColor: '#1d4ed8', bgcolor: '#eff6ff' }
                              }}
                            >
                              {creatingInvoiceId === job.id ? '...' : 'Generate Invoice'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {filteredJobs.length > 0 && (
                <TablePagination
                  component="div"
                  count={filteredJobs.length}
                  page={jobPage}
                  onPageChange={(e, v) => setJobPage(v)}
                  rowsPerPage={jobRowsPerPage}
                  onRowsPerPageChange={e => {
                    setJobRowsPerPage(parseInt(e.target.value, 10));
                    setJobPage(0);
                  }}
                  sx={{ borderTop: '1px solid #e2e8f0' }}
                />
              )}
            </Paper>
          </Box>
        )}

        {currentTab === 1 && (
          <Paper elevation={0} sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', bgcolor: '#ffffff', border: '1px solid #e2e8f0', p: 0 }}>
            {/* Filter Bar */}
            <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search invoice or client..."
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
                sx={{ minWidth: 240, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select value={historyEmpId} onChange={e => setHistoryEmpId(e.target.value)} displayEmpty sx={{ borderRadius: 2 }}>
                  <MenuItem value="all">All Employees</MenuItem>
                  {employees.map(e => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select value={historyStatus} onChange={e => setHistoryStatus(e.target.value)} displayEmpty sx={{ borderRadius: 2 }}>
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="sent">Sent</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="date"
                size="small"
                label="From"
                name="historyFilterFrom"
                autoComplete="off"
                InputLabelProps={{ shrink: true }}
                value={historyFromDate}
                onChange={e => setHistoryFromDate(e.target.value)}
                sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                name="historyFilterTo"
                autoComplete="off"
                InputLabelProps={{ shrink: true }}
                value={historyToDate}
                onChange={e => setHistoryToDate(e.target.value)}
                sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button 
                variant="contained" 
                size="small" 
                onClick={() => {
                  setAppliedHistoryFromDate(historyFromDate);
                  setAppliedHistoryToDate(historyToDate);
                }}
                sx={{ borderRadius: 2, px: 2, height: 40, textTransform: 'none' }}
              >
                Apply
              </Button>
              {(appliedHistoryFromDate || appliedHistoryToDate || historyFromDate || historyToDate || historyEmpId !== 'all' || historyStatus !== 'all' || historySearch !== '') && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => {
                    setHistoryFromDate('');
                    setHistoryToDate('');
                    setAppliedHistoryFromDate('');
                    setAppliedHistoryToDate('');
                    setHistoryEmpId('all');
                    setHistoryStatus('all');
                    setHistorySearch('');
                  }}
                  sx={{ borderRadius: 2, minWidth: 'auto', px: 1.5, height: 40, color: '#64748b', borderColor: '#cbd5e1' }}
                >
                  Clear
                </Button>
              )}
            </Box>

            {/* Active Filters */}
            {(historySearch || historyEmpId !== 'all' || historyStatus !== 'all' || historyFromDate || historyToDate) && (
              <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 13, color: '#64748b', mr: 1 }}>
                  Active Filters:
                </Typography>
                {historySearch && <Chip size="small" label={`Search: ${historySearch}`} onDelete={() => setHistorySearch('')} />}
                {historyEmpId !== 'all' && (
                  <Chip
                    size="small"
                    label={`Employee: ${employees.find(e => e.id === historyEmpId)?.name}`}
                    onDelete={() => setHistoryEmpId('all')}
                  />
                )}
                {historyStatus !== 'all' && <Chip size="small" label={`Status: ${historyStatus}`} onDelete={() => setHistoryStatus('all')} />}
                {historyFromDate && <Chip size="small" label={`From: ${historyFromDate}`} onDelete={() => setHistoryFromDate('')} />}
                {historyToDate && <Chip size="small" label={`To: ${historyToDate}`} onDelete={() => setHistoryToDate('')} />}
                <Button
                  size="small"
                  onClick={() => {
                    setHistorySearch('');
                    setHistoryEmpId('all');
                    setHistoryStatus('all');
                    setHistoryFromDate('');
                    setHistoryToDate('');
                  }}
                  sx={{ textTransform: 'none', color: '#1e40af', ml: 'auto' }}
                >
                  Clear All
                </Button>
              </Box>
            )}

            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f4f6fb' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Invoice #</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Employee</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 600 }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ '& tr:hover': { bgcolor: '#f8fafc' } }}>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 8, textAlign: 'center', color: '#94a3b8' }}>
                        <Typography>No invoices found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((inv) => (
                      <TableRow key={inv.id} sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <TableCell sx={{ fontWeight: 700, color: '#2563eb', fontFamily: 'monospace', fontSize: 13 }}>
                          {inv.invoice_number?.replace('#', '')}
                        </TableCell>
                        <TableCell>{inv.employee?.full_name || '-'}</TableCell>
                        <TableCell>{inv.client?.name || inv.client?.business_name || inv.employee?.full_name || '-'}</TableCell>
                        <TableCell>{inv.bill_date || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>${Number(inv.totals?.grand_total || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip label={inv.status || 'draft'} size="small" sx={{ bgcolor: getStatusChipSx(inv.status).bg, color: getStatusChipSx(inv.status).color, fontWeight: 700, fontSize: 11, height: 22, textTransform: 'capitalize', border: `1px solid ${getStatusChipSx(inv.status).color}30`, '& .MuiChip-label': { px: 1.2 } }} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate('/invoices/pdf-view', { state: { invoiceId: inv.id } })}
                            title="View"
                            sx={{ color: '#64748b' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => navigate('/invoices/pdf-view', { state: { invoiceId: inv.id, autoDownload: true } })}
                            title="Download PDF"
                            sx={{ color: '#64748b' }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={invoicesTotal}
              page={historyPage}
              onPageChange={(e, v) => setHistoryPage(v)}
              rowsPerPage={historyRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              onRowsPerPageChange={e => {
                setHistoryRowsPerPage(parseInt(e.target.value, 10));
                setHistoryPage(0);
              }}
              sx={{ borderTop: '1px solid #e2e8f0' }}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default InvoiceList;