import React, { useState } from 'react';
import {
  Box, Typography, Button, Tabs, Tab, Menu, MenuItem, Paper, CircularProgress, Snackbar, Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Filter, FileText, CalendarDays,
  ChevronDown, Printer, FileSpreadsheet, FileImage,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import ReportsKpiCards from './components/ReportsKpiCards';
import QuickFilters from './components/QuickFilters';
import RevenueChart from './components/RevenueChart';
import JobStatusChart from './components/JobStatusChart';
import EmployeePerformanceChart from './components/EmployeePerformanceChart';
import InvoiceAnalyticsChart from './components/InvoiceAnalyticsChart';
import ReportsTable from './components/ReportsTable';
import {
  TopCustomersPanel, TopEmployeesPanel,
  RevenueSummaryPanel, RecentActivitiesPanel,
} from './components/SidePanels';
import { tabOptions, ReportsDataProvider, useReportsData } from './data/reportsDummyData.jsx';
import * as exportService from './services/exportService';

// Tab Imports
import OverviewTab from './tabs/OverviewTab';
import CustomerReportTab from './tabs/CustomerReportTab';
import EmployeeReportTab from './tabs/EmployeeReportTab';
import RevenueTab from './tabs/RevenueTab';
import InvoiceReportTab from './tabs/InvoiceReportTab';
import JobStatusTab from './tabs/JobStatusTab';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const ReportsPageContent = () => {
  const { data, refetch } = useReportsData();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFilter, setActiveFilter] = useState('Monthly');
  const [exportAnchor, setExportAnchor] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Filter States
  const [customerFilter, setCustomerFilter] = useState('All Customers');
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [jobStatusFilter, setJobStatusFilter] = useState('All Status');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [applyTrigger, setApplyTrigger] = useState(0);

  const handleApplyFilters = () => {
    const filtersToApply = {
      period: activeFilter,
      customer: customerFilter,
      employee: employeeFilter,
      jobStatus: jobStatusFilter,
      serviceType: serviceFilter,
    };
    refetch(filtersToApply);
    setApplyTrigger(prev => prev + 1);
  };

  const filters = {
    activeFilter, setActiveFilter,
    customerFilter, setCustomerFilter,
    employeeFilter, setEmployeeFilter,
    jobStatusFilter, setJobStatusFilter,
    serviceFilter, setServiceFilter,
    onApply: handleApplyFilters,
    applyTrigger,
  };

  const handleExport = async (type) => {
    setExportAnchor(null);
    setIsExporting(true);
    const elementId = 'reports-content';
    const filename = `TrakJobs_${activeTab}_Report`;

    try {
      switch (type) {
        case 'pdf':
          await exportService.exportAsPDF(elementId, filename);
          break;
        case 'excel':
          exportService.exportAsExcel(data, filename);
          break;
        case 'image':
          await exportService.exportAsImage(elementId, filename);
          break;
        case 'print':
          await exportService.printReport(elementId);
          break;
        default: break;
      }
      setSnackbar({ open: true, message: `Report exported as ${type.toUpperCase()} successfully!`, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: `Export failed: ${err.message}`, severity: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fb', pb: 6 }}>
      {/* Header */}
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 0 }}>
        <PageHeader
          breadcrumb={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Reports', current: true },
            { label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1), current: true },
          ]}
          title="Reports & Analytics"
          actions={
            <>
              <Button
                variant="outlined" size="small"
                startIcon={<CalendarDays size={15} />}
                endIcon={<ChevronDown size={14} />}
                sx={{
                  textTransform: 'none', fontSize: 13, fontWeight: 600,
                  borderRadius: '10px', borderColor: '#e2e8f0', color: '#475569',
                  bgcolor: '#fff', px: 2, height: 38,
                  '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
                }}
              >
                May 01, 2024 - May 31, 2024
              </Button>
              <Button
                variant="contained" size="small"
                disabled={isExporting}
                startIcon={isExporting ? <CircularProgress size={16} color="inherit" /> : <Download size={15} />}
                endIcon={<ChevronDown size={14} />}
                onClick={e => setExportAnchor(e.currentTarget)}
                sx={{
                  textTransform: 'none', fontSize: 13, fontWeight: 700,
                  borderRadius: '10px', bgcolor: '#10b981', px: 2, height: 38,
                  boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                  '&:hover': { bgcolor: '#059669' },
                }}
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
              <Menu
                anchorEl={exportAnchor} open={Boolean(exportAnchor)}
                onClose={() => setExportAnchor(null)}
                PaperProps={{
                  sx: {
                    borderRadius: '12px', boxShadow: '0 12px 40px rgba(15,23,42,0.12)', 
                    minWidth: 200, mt: 1, p: 0.5,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {[
                  { label: 'Export as PDF', icon: <FileText size={16} />, type: 'pdf' },
                  { label: 'Export as Excel', icon: <FileSpreadsheet size={16} />, type: 'excel' },
                  { label: 'Export as Image', icon: <FileImage size={16} />, type: 'image' },
                  { label: 'Print Report', icon: <Printer size={16} />, type: 'print' },
                ].map((item, i) => (
                  <MenuItem key={i} onClick={() => handleExport(item.type)} sx={{
                    fontSize: 13, color: '#475569', gap: 1.5, py: 1.2, px: 2,
                    borderRadius: '8px', fontWeight: 500,
                    '&:hover': { bgcolor: '#f0f4ff', color: '#2563eb' },
                  }}>
                    {item.icon} {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          }
        />
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Paper elevation={0} sx={{
          borderRadius: '14px', border: '1px solid rgba(226,232,240,0.8)',
          bgcolor: '#fff', mb: 3, overflow: 'hidden',
        }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            variant="scrollable" scrollButtons="auto"
            sx={{
              px: 1.5, minHeight: 48,
              '& .MuiTab-root': {
                textTransform: 'none', fontWeight: 600, fontSize: 13,
                color: '#94a3b8', minHeight: 48, px: 2.5,
              },
              '& .Mui-selected': { color: '#2563eb !important', fontWeight: 700 },
              '& .MuiTabs-indicator': { backgroundColor: '#2563eb', height: 3 },
            }}
          >
            {tabOptions.filter(t => !['expense', 'performance'].includes(t.key)).map(t => <Tab key={t.key} label={t.label} value={t.key} />)}
          </Tabs>
        </Paper>

        <Box id="reports-content">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {activeTab === 'overview' && <OverviewTab filters={filters} />}
            {activeTab === 'customer' && <CustomerReportTab filters={filters} />}
            {activeTab === 'employee' && <EmployeeReportTab filters={filters} />}
            {activeTab === 'revenue' && <RevenueTab filters={filters} />}
            {activeTab === 'invoice' && <InvoiceReportTab filters={filters} />}
            {activeTab === 'jobs' && <JobStatusTab filters={filters} />}
          </motion.div>
        </Box>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const ReportsPage = () => {
  return (
    <ReportsDataProvider>
      <ReportsPageContent />
    </ReportsDataProvider>
  );
};

export default ReportsPage;
