import React from 'react';
import { Avatar, Box, Button, Paper, TextField, Typography } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import PageHeader from '../../components/common/PageHeader';
import SummaryCard from '../../components/invoice/SummaryCard';

const InvoicePreview = ({ invoiceData, onBackToList }) => {
  const {
    invoiceNumber,
    customer,
    totalAmount,
    billDate,
    deliveryDate,
    paymentDeadline,
    mileage,
    billingAddress,
    note,
    terms,
    summary,
  } = invoiceData;

  return (
    <Box>
      <PageHeader
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Invoices', onClick: onBackToList },
          { label: 'Generate Invoice', current: true },
        ]}
        title={`Invoice ${invoiceNumber}`}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2.2fr 1fr' }, gap: 1.25 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid #ebedf0',
            p: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={customer.avatar} sx={{ width: 84, height: 84 }}>
                {customer.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#21262f', lineHeight: 1.2 }}>
                  {customer.name}
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#596170' }}>{customer.address}</Typography>
                <Typography sx={{ fontSize: 14, color: '#596170' }}>{customer.contact}</Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Box
                sx={{
                  display: 'inline-block',
                  bgcolor: '#f2f4f7',
                  px: 1,
                  py: 0.4,
                  borderRadius: 1.5,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#596170',
                  mb: 1.5,
                }}
              >
                {invoiceNumber}
              </Box>
              <Typography sx={{ fontSize: 12, color: '#7f8795', fontWeight: 600 }}>Total Amount</Typography>
              <Typography sx={{ fontSize: 28, color: '#303747', fontWeight: 700 }}>${totalAmount}</Typography>
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{ borderRadius: 2, border: '1px solid #e4e6ea', p: 1.25, mb: 1.25 }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '190px 1fr' }, gap: 1.5 }}>
              <Box
                sx={{
                  bgcolor: '#f4f5f7',
                  borderRadius: 1.5,
                  p: 1.25,
                  minHeight: 210,
                }}
              >
                <Typography sx={{ fontSize: 12, color: '#7f8795', mb: 0.25 }}>Bill Date</Typography>
                <Typography sx={{ fontSize: 18, color: '#3c4250', fontWeight: 700, mb: 0.9 }}>{billDate}</Typography>

                <Typography sx={{ fontSize: 12, color: '#7f8795', mb: 0.25 }}>Delivery Date</Typography>
                <Typography sx={{ fontSize: 18, color: '#3c4250', fontWeight: 700, mb: 0.9 }}>{deliveryDate}</Typography>

                <Typography sx={{ fontSize: 12, color: '#7f8795', mb: 0.25 }}>Payment Deadline</Typography>
                <Typography sx={{ fontSize: 18, color: '#3c4250', fontWeight: 700, mb: 0.9 }}>{paymentDeadline}</Typography>

                <Typography sx={{ fontSize: 12, color: '#7f8795', mb: 0.25 }}>Add Milage</Typography>
                <Typography sx={{ fontSize: 20, color: '#3c4250', fontWeight: 700 }}>{mileage}</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 12, color: '#7f8795', mb: 0.4 }}>Billing Address</Typography>
                <Typography sx={{ fontSize: 18, color: '#3c4250', fontWeight: 700 }}>{billingAddress.name}</Typography>
                <Typography sx={{ fontSize: 14, color: '#5f6776', lineHeight: 1.35 }}>{billingAddress.street}</Typography>
                <Typography sx={{ fontSize: 14, color: '#5f6776', lineHeight: 1.35, mb: 0.9 }}>{billingAddress.contact}</Typography>

                <Typography sx={{ fontSize: 12, color: '#7f8795', mb: 0.3 }}>Note</Typography>
                <Typography sx={{ fontSize: 14, color: '#505867', lineHeight: 1.35 }}>{note}</Typography>
              </Box>
            </Box>
          </Paper>

          <Typography sx={{ fontSize: 12, color: '#7f8795', mb: 0.2 }}>Terms &amp; Conditions</Typography>
          <Typography sx={{ fontSize: 14, color: '#444b59' }}>{terms}</Typography>
        </Paper>

        <Box>
          <SummaryCard data={summary} />

          <TextField
            placeholder="Enter Email ID"
            fullWidth
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                fontSize: 13,
                height: 44,
                bgcolor: '#fff',
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            startIcon={<SendOutlinedIcon />}
            sx={{
              mt: 0.9,
              height: 44,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 600,
              bgcolor: '#2e74d0',
              '&:hover': { bgcolor: '#2e74d0' },
            }}
          >
            Send Invoice
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoicePreview;