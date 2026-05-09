import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, InputAdornment, FormControl,
  Select, MenuItem, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton,
} from '@mui/material';
import { Search, MoreHorizontal } from 'lucide-react';
import { recentReportsData } from '../data/reportsDummyData';

const statusSx = {
  'Completed': { bg: '#f0fdf4', color: '#16a34a', border: '#16a34a30' },
  'In Progress': { bg: '#eff6ff', color: '#2563eb', border: '#2563eb30' },
  'Pending': { bg: '#fffbeb', color: '#d97706', border: '#d9770630' },
  'Cancelled': { bg: '#fef2f2', color: '#dc2626', border: '#dc262630' },
};

const ReportsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = recentReportsData.filter(r => {
    if (search && !Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    if (typeFilter !== 'all' && r.serviceType.toLowerCase() !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status.toLowerCase().replace(' ', '_') !== statusFilter) return false;
    return true;
  });

  const displayed = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={0} sx={{
      borderRadius: 3, border: '1px solid #e8edf5', bgcolor: '#fff', overflow: 'hidden',
      transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
    }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 1.5 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Recent Reports</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small" placeholder="Search by job, customer or employee..."
            value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} color="#94a3b8" /></InputAdornment> }}
            sx={{ minWidth: 260, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13, height: 36 } }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              sx={{ borderRadius: 2, fontSize: 12, height: 36, color: '#64748b' }}>
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="installation">Installation</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="repair">Repair</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              sx={{ borderRadius: 2, fontSize: 12, height: 36, color: '#64748b' }}>
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              {['Job ID', 'Customer', 'Employee', 'Service Type', 'Amount', 'Status', 'Date', ''].map((h, i) => (
                <TableCell key={i} sx={{
                  color: '#64748b', fontWeight: 600, fontSize: 12, py: 1.5,
                  position: 'sticky', top: 0, bgcolor: '#f8fafc', zIndex: 1,
                  ...(h === '' ? { width: 40 } : {}),
                }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayed.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ py: 6, textAlign: 'center', color: '#94a3b8' }}>
                  <Typography>No reports found</Typography>
                </TableCell>
              </TableRow>
            ) : displayed.map((r, i) => {
              const st = statusSx[r.status] || statusSx['Pending'];
              return (
                <TableRow key={i} sx={{
                  borderBottom: '1px solid #f8fafc',
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: '#f8fafc' },
                }}>
                  <TableCell sx={{ fontWeight: 600, color: '#2563eb', fontSize: 13, fontFamily: 'monospace' }}>{r.jobId}</TableCell>
                  <TableCell sx={{ fontSize: 13, color: '#1e293b' }}>{r.customer}</TableCell>
                  <TableCell sx={{ fontSize: 13, color: '#475569' }}>{r.employee}</TableCell>
                  <TableCell sx={{ fontSize: 13, color: '#475569' }}>{r.serviceType}</TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{r.amount}</TableCell>
                  <TableCell>
                    <Chip label={r.status} size="small" sx={{
                      bgcolor: st.bg, color: st.color, fontWeight: 700, fontSize: 11,
                      height: 22, border: `1px solid ${st.border}`,
                      '& .MuiChip-label': { px: 1.2 },
                    }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: '#475569' }}>{r.date}</TableCell>
                  <TableCell sx={{ width: 40 }}>
                    <IconButton size="small" sx={{ color: '#94a3b8' }}>
                      <MoreHorizontal size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, borderTop: '1px solid #f1f5f9' }}>
        <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>
          Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filtered.length)} of {filtered.length} results
        </Typography>
        <TablePagination
          component="div" count={filtered.length} page={page}
          onPageChange={(e, p) => setPage(p)} rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          sx={{ borderTop: 'none', '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontSize: 12 } }}
        />
      </Box>
    </Paper>
  );
};

export default ReportsTable;
