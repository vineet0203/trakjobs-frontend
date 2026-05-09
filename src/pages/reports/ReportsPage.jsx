import React, { useState } from 'react';
import {
  Box, Typography, Button, Tabs, Tab, TextField, InputAdornment,
  Menu, MenuItem, IconButton, Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Download, Filter, Search, FileText, CalendarDays,
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
import { tabOptions } from './data/reportsDummyData';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFilter, setActiveFilter] = useState('Monthly');
  const [exportAnchor, setExportAnchor] = useState(null);
  const [customerFilter, setCustomerFilter] = useState('All Customers');
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [jobStatusFilter, setJobStatusFilter] = useState('All Status');
  const [paymentFilter, setPaymentFilter] = useState('All Status');
  const [serviceFilter, setServiceFilter] = useState('All Services');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fb', pb: 5 }}>
      {/* Header */}
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 0 }}>
        <PageHeader
          breadcrumb={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Reports', current: true },
            { label: 'Overview', current: true },
          ]}
          title="Reports & Analytics"
          actions={
            <>
              {/* Date Range Picker */}
              <Button
                variant="outlined" size="small"
                startIcon={<CalendarDays size={15} />}
                endIcon={<ChevronDown size={14} />}
                sx={{
                  textTransform: 'none', fontSize: 13, fontWeight: 600,
                  borderRadius: 2, borderColor: '#e2e8f0', color: '#475569',
                  bgcolor: '#fff', px: 2, height: 38,
                  '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
                }}
              >
                May 01, 2024 - May 31, 2024
              </Button>

              {/* Advanced Filters */}
              <Button
                variant="outlined" size="small"
                startIcon={<Filter size={15} />}
                sx={{
                  textTransform: 'none', fontSize: 13, fontWeight: 600,
                  borderRadius: 2, borderColor: '#e2e8f0', color: '#475569',
                  bgcolor: '#fff', px: 2, height: 38,
                  '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
                }}
              >
                Advanced Filters
              </Button>

              {/* Export */}
              <Button
                variant="contained" size="small"
                startIcon={<Download size={15} />}
                endIcon={<ChevronDown size={14} />}
                onClick={e => setExportAnchor(e.currentTarget)}
                sx={{
                  textTransform: 'none', fontSize: 13, fontWeight: 600,
                  borderRadius: 2, bgcolor: '#10b981', px: 2, height: 38,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#059669', boxShadow: 'none' },
                }}
              >
                Export
              </Button>
              <Menu
                anchorEl={exportAnchor} open={Boolean(exportAnchor)}
                onClose={() => setExportAnchor(null)}
                PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 180 } }}
              >
                {[
                  { label: 'Export as PDF', icon: <FileText size={15} /> },
                  { label: 'Export as Excel', icon: <FileSpreadsheet size={15} /> },
                  { label: 'Export as Image', icon: <FileImage size={15} /> },
                  { label: 'Print Report', icon: <Printer size={15} /> },
                ].map((item, i) => (
                  <MenuItem key={i} onClick={() => setExportAnchor(null)}
                    sx={{ fontSize: 13, color: '#475569', gap: 1.5, py: 1 }}>
                    {item.icon} {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          }
        />
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        {/* Tabs */}
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff', mb: 3, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            variant="scrollable" scrollButtons="auto"
            sx={{
              px: 1, minHeight: 46,
              '& .MuiTab-root': {
                textTransform: 'none', fontWeight: 600, fontSize: 13,
                color: '#64748b', minHeight: 46, px: 2.5,
              },
              '& .Mui-selected': { color: '#2563eb !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#2563eb', height: 3, borderRadius: '3px 3px 0 0' },
            }}
          >
            {tabOptions.map(t => <Tab key={t.key} label={t.label} value={t.key} />)}
          </Tabs>
        </Paper>

        {/* Quick Filters */}
        <QuickFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filters={{
            customerFilter, setCustomerFilter,
            employeeFilter, setEmployeeFilter,
            jobStatusFilter, setJobStatusFilter,
            paymentFilter, setPaymentFilter,
            serviceFilter, setServiceFilter,
          }}
        />

        {/* KPI Cards */}
        <ReportsKpiCards />

        {/* Charts Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: '1.2fr 0.8fr 1fr 1fr' },
            gap: 2.5, mb: 3,
          }}>
            <Box sx={{ gridColumn: { xs: '1', xl: '1' } }}>
              <RevenueChart />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', xl: '2' } }}>
              <JobStatusChart />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', xl: '3' } }}>
              <EmployeePerformanceChart />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', xl: '4' } }}>
              <InvoiceAnalyticsChart />
            </Box>
          </Box>
        </motion.div>

        {/* Table + Side Panels */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
            gap: 2.5, mb: 3,
          }}>
            {/* Reports Table */}
            <ReportsTable />

            {/* Side Panels */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TopCustomersPanel />
              <TopEmployeesPanel />
            </Box>
          </Box>
        </motion.div>

        {/* Bottom Panels */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2.5,
          }}>
            <RevenueSummaryPanel />
            <RecentActivitiesPanel />
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default ReportsPage;
