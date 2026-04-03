import React from 'react';
import { useToast } from '../../../components/common/ToastProvider';
import { Box } from '@mui/material';
import PageHeader from '../../../components/common/PageHeader';
import BookingForm from '../components/BookingForm/BookingForm';
import bookingService from '../services/bookingService';

const OnlineBooking = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const booking = await bookingService.createBooking(formData);
      console.log('Online booking confirmed:', booking);
      showToast('Booking Confirmed', 'success');
      return booking;
    } catch (error) {
      showToast(error?.userMessage || 'Payment succeeded but booking save failed.', 'error');
      console.error('Failed to confirm booking:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Online Booking', current: true },
        ]}
      />

      <BookingForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default OnlineBooking;