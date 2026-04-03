import React, { useMemo, useState } from 'react';
import { Box, Button, ButtonGroup, FormControl, MenuItem, Paper, Popover, Select, Stack, TextField, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PageHeader from '../../components/common/PageHeader';
import CrewList from '../../components/invoice/CrewList';
import JobCard from '../../components/invoice/JobCard';
import InvoicePreview from './InvoicePreview';

const crewMembers = [
  { id: 1, name: 'Jhon', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', team: 'all' },
  { id: 2, name: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', team: 'all' },
  { id: 3, name: 'Sarah', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', team: 'all' },
  { id: 4, name: 'Carlos', avatar: 'https://randomuser.me/api/portraits/men/71.jpg', team: 'all' },
  { id: 5, name: 'Carelina', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', team: 'all' },
];

const jobsByCrew = {
  1: [
    { id: 1, jobId: '#Jb-1024', jobName: 'Home Repair Services', date: '12-Jan-2026', viewType: 'Weekly', rate: 500 },
    { id: 2, jobId: '#Jb-1024', jobName: 'AC repair at Residence', date: '14-Jan-2026', viewType: 'Weekly', rate: 100 },
    { id: 3, jobId: '#Jb-1024', jobName: 'Gardening Landscaping', date: '16-Jan-2026', viewType: 'Weekly', rate: 200 },
  ],
  2: [
    { id: 4, jobId: '#Jb-2090', jobName: 'Kitchen Plumbing Service', date: '11-Jan-2026', viewType: 'Weekly', rate: 220 },
    { id: 5, jobId: '#Jb-2091', jobName: 'Wall Paint Touchup', date: '13-Jan-2026', viewType: 'Weekly', rate: 180 },
  ],
  3: [
    { id: 6, jobId: '#Jb-3380', jobName: 'Garden Maintenance', date: '15-Jan-2026', viewType: 'Weekly', rate: 160 },
  ],
  4: [
    { id: 7, jobId: '#Jb-4011', jobName: 'Residential Wiring', date: '17-Jan-2026', viewType: 'Weekly', rate: 420 },
  ],
  5: [
    { id: 8, jobId: '#Jb-5020', jobName: 'Bathroom Deep Cleaning', date: '18-Jan-2026', viewType: 'Weekly', rate: 140 },
  ],
};

const InvoiceList = () => {
  const [selectedCrewId, setSelectedCrewId] = useState(1);
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState('all');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [selectedView, setSelectedView] = useState('month');
  const [viewAnchorEl, setViewAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 6));
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const jobs = useMemo(() => {
    return jobsByCrew[selectedCrewId] || [];
  }, [selectedCrewId]);

  const selectedCrew = crewMembers.find((member) => member.id === selectedCrewId) || crewMembers[0];

  if (showPreview) {
    return (
      <InvoicePreview
        onBackToList={() => setShowPreview(false)}
        invoiceData={{
          invoiceNumber: '#2020-05-0001',
          customer: {
            name: 'John Brandon',
            avatar: selectedCrew.avatar,
            address: '789/1 Sector-2c, 38200 Gandhinagar, France',
            contact: '848172194 | contact@betao.se',
          },
          totalAmount: '1,000',
          billDate: '03/05/2020',
          deliveryDate: '03/05/2020',
          paymentDeadline: '05/18/2020',
          mileage: '$50',
          billingAddress: {
            name: 'Willy Wonka',
            street: '1445 West Norwood Avenue, Itasca, illinois, USA',
            contact: '9723041054 | om@om.com',
          },
          note: 'This is a custom message that might be relevant to the customer. It can span up to three or four rows. It can span up to three or four rows.',
          terms: 'Please pay within 15 days of receiving this invoice.',
          summary: {
            weeklyAmount: '$1,000 Incl. VAT',
            milage: '$50',
            otherExpense: 'NA',
            total: '$1050  Incl. VAT',
          },
        }}
      />
    );
  }

  const isViewDropdownOpen = Boolean(viewAnchorEl);

  const handleViewClick = (view, event) => {
    setSelectedView(view);
    setViewAnchorEl(event.currentTarget);
  };

  const handleCloseViewDropdown = () => {
    setViewAnchorEl(null);
  };

  return (
    <Box sx={{ height: 'auto' }}>
      <PageHeader
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Invoices', current: true },
        ]}
        title="Invoices"
      />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #d8dde6',
          p: { xs: 1.25, md: 2 },
          backgroundColor: '#f9f9fa',
          height: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr auto' },
            gap: 1.25,
            mb: 1.25,
            alignItems: 'end',
          }}
        >
          <FormControl fullWidth>
            <Typography sx={{ fontSize: 12, color: '#7a8190', ml: 0.75, mb: 0.25 }}>Employees</Typography>
            <Select
              value={selectedEmployeeFilter}
              onChange={(event) => setSelectedEmployeeFilter(event.target.value)}
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                height: 44,
                borderRadius: 1.5,
                bgcolor: '#fff',
                fontSize: 14,
                color: '#2e3442',
              }}
            >
              <MenuItem value="all">All Employees</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Typography sx={{ fontSize: 12, color: '#7a8190', ml: 0.75, mb: 0.25 }}>Teams</Typography>
            <Select
              value={selectedTeamFilter}
              onChange={(event) => setSelectedTeamFilter(event.target.value)}
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                height: 44,
                borderRadius: 1.5,
                bgcolor: '#fff',
                fontSize: 14,
                color: '#2e3442',
              }}
            >
              <MenuItem value="all">All Teams</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{
              justifySelf: { xs: 'start', md: 'end' },
              display: 'inline-flex',
            }}
          >
            <ButtonGroup variant="outlined" aria-label="invoice view selection">
              {['month', 'week', 'day'].map((view) => (
                <Button
                  key={view}
                  variant={selectedView === view ? 'contained' : 'outlined'}
                  onClick={(event) => handleViewClick(view, event)}
                  sx={{ textTransform: 'none', minWidth: 84 }}
                >
                  {view}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        </Box>

        <Popover
          open={isViewDropdownOpen}
          anchorEl={viewAnchorEl}
          onClose={handleCloseViewDropdown}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                p: 2,
                width: selectedView === 'month' ? 320 : 360,
              },
            },
          }}
        >
          {selectedView === 'month' ? (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} />
            </LocalizationProvider>
          ) : (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="From"
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="To"
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          )}
        </Popover>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 2.6fr' },
            gap: 1,
            alignItems: 'start',
            height: 'auto',
          }}
        >
          <CrewList
            crewMembers={crewMembers}
            selectedCrewId={selectedCrewId}
            onSelect={setSelectedCrewId}
          />

          <Paper
            elevation={0}
            sx={{
              border: '1px solid #3f79c7',
              borderRadius: 2,
              p: 1.25,
              height: 'auto',
              position: 'relative',
            }}
          >
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#3b3b3b', pb: 1, borderBottom: '1px solid #e8e8e8', lineHeight: 1 }}>
              Job Details
            </Typography>

            <Box sx={{ mt: 1, position: 'relative' }}>
              <Box sx={{ position: 'absolute', left: 16, top: 20, bottom: 26, width: 2, bgcolor: '#2f73d2', opacity: 0.7 }} />
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} selectedView={selectedView} />
              ))}
            </Box>

            {selectedView === 'month' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1, mt: -0.5 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#2c2f39' }}>
                  Job Rate: $200
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.25, pr: 0.5, pb: 0.25 }}>
              <Button
                variant="contained"
                onClick={() => setShowPreview(true)}
                startIcon={<DescriptionOutlinedIcon />}
                sx={{
                  bgcolor: '#2f73d2',
                  '&:hover': { bgcolor: '#2f73d2' },
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  px: 2.25,
                  height: 42,
                }}
              >
                Generate Invoice
              </Button>
            </Box>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoiceList;