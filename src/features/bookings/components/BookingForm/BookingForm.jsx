import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    ButtonBase,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
    Button,
    Paper as MuiPaper,
    TextField,
    Switch,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfDay } from 'date-fns';
import { useToast } from '../../../../components/common/ToastProvider';
import bookingService from '../../services/bookingService';
import { STATE_OPTIONS } from '../../../clients/constants/clientConstants';

const steps = [
    '1. Select Service',
    '2. Choose Date',
    '3. Select Time',
    '4. Add Details',
    '5. Pay & Confirm'
];

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: '#FFFFFF',
        '& fieldset': {
            borderColor: '#6C6A6A'
        },
        '&:hover fieldset': {
            borderColor: '#6C6A6A'
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4E88DC'
        }
    },
    '& .MuiSelect-select': {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        color: '#1F2937',
        py: 1.75
    },
    '& .MuiInputLabel-root': {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        color: '#6C6A6A'
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#4E88DC'
    }
};

const placeholderMenuItem = (
    <MenuItem value="" disabled>
        Select
    </MenuItem>
);

const buildMapUrl = (address) => {
    const query = encodeURIComponent(address || 'Lower Manhattan, New York, NY 10003, USA');
    return `https://www.openstreetmap.org/export/embed.html?search=${query}&layer=mapnik`;
};

const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM'
];

const BookingForm = ({ onSubmit, isLoading = false }) => {
    const { showToast } = useToast();
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState({
        category: '',
        customerId: '',
        employeeId: '',
        locationId: ''
    });
    const [bookingDate, setBookingDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [stepFourPayload, setStepFourPayload] = useState(null);
    const [stepFivePayload, setStepFivePayload] = useState(null);
    const [clientName, setClientName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [serviceAddress, setServiceAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [isFree, setIsFree] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentTouched, setPaymentTouched] = useState({});
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [touched, setTouched] = useState({});
    const [detailTouched, setDetailTouched] = useState({});
    const [categories, setCategories] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loadingState, setLoadingState] = useState({
        categories: false,
        customers: false,
        employees: false
    });

    const selectedLocation = useMemo(
        () => STATE_OPTIONS.find((stateOption) => stateOption.value === formValues.locationId),
        [formValues.locationId]
    );

    const errors = {
        category: formValues.category ? '' : 'Service category is required.',
        customerId: formValues.customerId ? '' : 'Customer is required.',
        employeeId: formValues.employeeId ? '' : 'Service provider is required.',
        locationId: formValues.locationId ? '' : 'Location is required.'
    };

    const detailErrors = {
        clientName: clientName.trim() ? '' : 'Client name is required.',
        email: email.trim()
            ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? '' : 'Enter a valid email address.')
            : 'Email address is required.',
        mobile: mobile.trim()
            ? (/^\d{7,15}$/.test(mobile.trim()) ? '' : 'Enter a valid mobile number.')
            : 'Mobile is required.',
        serviceAddress: serviceAddress.trim() ? '' : 'Service address is required.'
    };

    const isFormValid = Object.values(errors).every((value) => value === '');
    const isStepFourValid = Object.values(detailErrors).every((value) => value === '');
    const paymentErrors = {
        cardNumber: cardNumber.trim() ? '' : 'Card number is required.',
        cardExpiry: cardExpiry.trim() ? '' : 'Card expiry is required.',
        cvv: cvv.trim() ? '' : 'CVV is required.',
        cardHolderName: cardHolderName.trim() ? '' : 'Card holder name is required.'
    };
    const isStepFiveValid = Object.values(paymentErrors).every((value) => value === '');
    const amount = isFree ? 0 : 50;

    const selectedCategoryName = useMemo(() => {
        const selected = categories.find((category) => String(category.id) === String(formValues.category));
        return selected?.name || formValues.category;
    }, [categories, formValues.category]);

    const formattedBookingDate = useMemo(() => {
        return bookingDate ? format(bookingDate, 'EEEE, d MMMM, yyyy') : '';
    }, [bookingDate]);

    useEffect(() => {
        let isMounted = true;

        const loadInitialOptions = async () => {
            setLoadingState((prev) => ({
                ...prev,
                categories: true,
                employees: true
            }));

            try {
                const [categoryOptions, employeeOptions] = await Promise.all([
                    bookingService.getCategories(),
                    bookingService.getEmployees()
                ]);

                if (!isMounted) {
                    return;
                }

                setCategories(categoryOptions);
                setEmployees(employeeOptions.filter((employee) => employee.is_active !== false));
            } catch (error) {
                if (isMounted) {
                    showToast(error.userMessage || 'Failed to load booking options.', 'error');
                }
            } finally {
                if (isMounted) {
                    setLoadingState((prev) => ({
                        ...prev,
                        categories: false,
                        employees: false
                    }));
                }
            }
        };

        loadInitialOptions();

        return () => {
            isMounted = false;
        };
    }, [showToast]);

    const fetchCustomers = async (category) => {
        setLoadingState((prev) => ({ ...prev, customers: true }));

        try {
            const customerOptions = await bookingService.getCustomers(category);
            setCustomers(customerOptions);
        } catch (error) {
            setCustomers([]);
            showToast(error.userMessage || 'Failed to load customers.', 'error');
        } finally {
            setLoadingState((prev) => ({ ...prev, customers: false }));
        }
    };

    const handleFieldChange = (field) => async (event) => {
        const nextValue = event.target.value;

        if (field === 'category') {
            setTouched((prev) => ({
                ...prev,
                category: true,
                customerId: false,
                locationId: false
            }));
            setFormValues((prev) => ({
                ...prev,
                category: nextValue,
                customerId: '',
                locationId: ''
            }));
            setCustomers([]);

            if (nextValue) {
                await fetchCustomers(nextValue);
            }

            return;
        }

        if (field === 'customerId') {
            setTouched((prev) => ({
                ...prev,
                customerId: true,
                locationId: false
            }));
            setFormValues((prev) => ({
                ...prev,
                customerId: nextValue,
                locationId: ''
            }));

            return;
        }

        setTouched((prev) => ({ ...prev, [field]: true }));
        setFormValues((prev) => ({
            ...prev,
            [field]: nextValue
        }));
    };

    const handleBlur = (field) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleStepOneNext = async () => {
        setTouched({
            category: true,
            customerId: true,
            employeeId: true,
            locationId: true
        });

        if (!isFormValid) {
            return;
        }

        setActiveStep(1);
    };

    const handleStepTwoNext = () => {
        if (!bookingDate) {
            return;
        }

        setActiveStep(2);
    };

    const handleStepThreeNext = async () => {
        if (!selectedTime || !bookingDate) {
            return;
        }

        const payload = {
            category: formValues.category,
            customerId: Number(formValues.customerId),
            employeeId: Number(formValues.employeeId),
            locationId: formValues.locationId,
            bookingDate: format(bookingDate, 'yyyy-MM-dd'),
            bookingTime: selectedTime
        };

        setStepFourPayload(payload);
        setActiveStep(3);
    };

    const handleStepFourNext = async () => {
        setDetailTouched({
            clientName: true,
            email: true,
            mobile: true,
            serviceAddress: true
        });

        if (!isStepFourValid || !stepFourPayload) {
            return;
        }

        const payload = {
            ...stepFourPayload,
            clientName: clientName.trim(),
            email: email.trim(),
            mobile: mobile.trim(),
            serviceAddress: serviceAddress.trim(),
            amount
        };

        setStepFivePayload(payload);
        setPaymentSuccess(false);
        setActiveStep(4);
    };

    const handlePayment = async () => {
        setPaymentTouched({
            cardNumber: true,
            cardExpiry: true,
            cvv: true,
            cardHolderName: true
        });

        if (!isStepFiveValid || !stepFivePayload || isProcessingPayment || isLoading) {
            return;
        }

        setIsProcessingPayment(true);
        setPaymentSuccess(false);
        setReceiptData(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const payload = {
                ...stepFivePayload,
                amount,
                payment_status: 'SUCCESS',
                payment_method: 'DUMMY',
                transaction_id: `DUMMY_TXN_${Date.now()}`
            };

            const bookingResult = onSubmit ? await onSubmit(payload) : null;

            setReceiptData({
                bookingId: bookingResult?.id || `BK-${Date.now()}`,
                transactionId: payload.transaction_id,
                amount: payload.amount,
            });

            setPaymentSuccess(true);
        } catch (error) {
            showToast(error?.userMessage || 'Payment failed. Please retry.', 'error');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const isStepThreeNextDisabled = !selectedTime || !bookingDate || isLoading;

    const renderStepOne = () => (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.04fr 1fr' },
                alignItems: 'stretch'
            }}
        >
            <Box
                sx={{
                    minHeight: { xs: 340, md: 500 },
                    borderRight: { xs: 'none', md: '1px solid rgba(108, 106, 106, 0.15)' },
                    borderBottom: { xs: '1px solid rgba(108, 106, 106, 0.15)', md: 'none' },
                    bgcolor: '#DDEAF7'
                }}
            >
                <Box
                    component="iframe"
                    title="Selected location map"
                    src={buildMapUrl(selectedLocation ? `${selectedLocation.label}, USA` : undefined)}
                    sx={{
                        width: '100%',
                        height: '100%',
                        minHeight: { xs: 340, md: 500 },
                        border: 0,
                        display: 'block'
                    }}
                />
            </Box>

            <Box
                sx={{
                    px: { xs: 3, md: 5 },
                    py: { xs: 3, md: 4.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <Typography
                    sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#111827',
                        mb: 0.5
                    }}
                >
                    Service Selection
                </Typography>

                <Typography
                    sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        color: '#A0A0A0',
                        mb: 2.75
                    }}
                >
                    Select a Service
                </Typography>

                <Stack spacing={2.5}>
                    <FormControl fullWidth error={Boolean(touched.category && errors.category)} sx={fieldSx}>
                        <InputLabel id="booking-category-label">Choose Service Category *</InputLabel>
                        <Select
                            labelId="booking-category-label"
                            label="Choose Service Category *"
                            value={formValues.category}
                            disabled={loadingState.categories}
                            onBlur={handleBlur('category')}
                            onChange={handleFieldChange('category')}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {loadingState.categories ? <FormHelperText>Loading service categories...</FormHelperText> : null}
                        {touched.category && errors.category ? <FormHelperText>{errors.category}</FormHelperText> : null}
                    </FormControl>

                    <FormControl fullWidth error={Boolean(touched.customerId && errors.customerId)} sx={fieldSx}>
                        <InputLabel id="booking-customer-label">Select Customer *</InputLabel>
                        <Select
                            labelId="booking-customer-label"
                            label="Select Customer *"
                            value={formValues.customerId}
                            displayEmpty
                            disabled={!formValues.category || loadingState.customers}
                            onBlur={handleBlur('customerId')}
                            onChange={handleFieldChange('customerId')}
                        >
                            {placeholderMenuItem}
                            {customers.map((customer) => (
                                <MenuItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {loadingState.customers ? <FormHelperText>Loading customers...</FormHelperText> : null}
                        {touched.customerId && errors.customerId ? <FormHelperText>{errors.customerId}</FormHelperText> : null}
                    </FormControl>

                    <FormControl fullWidth error={Boolean(touched.employeeId && errors.employeeId)} sx={fieldSx}>
                        <InputLabel id="booking-employee-label" shrink>Select Service Provider *</InputLabel>
                        <Select
                            labelId="booking-employee-label"
                            label="Select Service Provider *"
                            value={formValues.employeeId}
                            displayEmpty
                            disabled={loadingState.employees}
                            onBlur={handleBlur('employeeId')}
                            onChange={handleFieldChange('employeeId')}
                            renderValue={(selected) => {
                                if (!loadingState.employees && employees.length === 0) {
                                    return 'No service providers found';
                                }

                                if (!selected) {
                                    return 'Select';
                                }

                                const selectedEmployee = employees.find((employee) => String(employee.id) === String(selected));
                                return selectedEmployee?.name || 'Select';
                            }}
                        >
                            {placeholderMenuItem}
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.name}
                                </MenuItem>
                            ))}
                            {!loadingState.employees && employees.length === 0 ? (
                                <MenuItem value="" disabled>
                                    No service providers found
                                </MenuItem>
                            ) : null}
                        </Select>
                        {loadingState.employees ? <FormHelperText>Loading service providers...</FormHelperText> : null}
                        {!loadingState.employees && employees.length === 0 ? <FormHelperText>No service providers found for this account.</FormHelperText> : null}
                        {touched.employeeId && errors.employeeId ? <FormHelperText>{errors.employeeId}</FormHelperText> : null}
                    </FormControl>

                    <FormControl fullWidth error={Boolean(touched.locationId && errors.locationId)} sx={fieldSx}>
                        <InputLabel id="booking-location-label">Select Location *</InputLabel>
                        <Select
                            labelId="booking-location-label"
                            label="Select Location *"
                            value={formValues.locationId}
                            displayEmpty
                            disabled={!formValues.customerId}
                            onBlur={handleBlur('locationId')}
                            onChange={handleFieldChange('locationId')}
                        >
                            {placeholderMenuItem}
                            {STATE_OPTIONS.map((stateOption) => (
                                <MenuItem key={stateOption.value} value={stateOption.value}>
                                    {stateOption.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {touched.locationId && errors.locationId ? <FormHelperText>{errors.locationId}</FormHelperText> : null}
                    </FormControl>
                </Stack>

                <Box textAlign="center" sx={{ mt: 3.75 }}>
                    <Button
                        variant="contained"
                        onClick={handleStepOneNext}
                        disabled={!isFormValid || isLoading}
                        sx={{
                            minWidth: 88,
                            height: 38,
                            borderRadius: '8px',
                            bgcolor: isFormValid && !isLoading ? '#4E88DC' : '#B8B8B8',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: isFormValid && !isLoading ? '#4E88DC' : '#B8B8B8',
                                boxShadow: 'none'
                            },
                            '&.Mui-disabled': {
                                color: '#FFFFFF',
                                bgcolor: '#B8B8B8'
                            }
                        }}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </Box>
    );

    const renderStepTwo = () => (
        <Box sx={{ px: 4, py: { xs: 4, md: 2 }, minHeight: 500 }}>
            <Typography
                align="center"
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '34px',
                    fontWeight: 600,
                    color: '#161616',
                    letterSpacing: '-0.2px',
                    mb: 2.25
                }}
            >
                Choose Date
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <MuiPaper
                    elevation={0}
                    sx={{
                        width: 430,
                        borderRadius: '18px',
                        bgcolor: '#F4F4F5',
                        py: 1
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateCalendar
                            value={bookingDate}
                            onChange={(date) => {
                                setBookingDate(date ? startOfDay(date) : null);
                                setSelectedTime(null);
                            }}
                            disablePast
                            minDate={startOfDay(new Date())}
                            sx={{
                                width: '100%',
                                '& .MuiPickersCalendarHeader-root': {
                                    px: 2,
                                    minHeight: 42
                                },
                                '& .MuiPickersCalendarHeader-label': {
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 600,
                                    color: '#6C6A6A',
                                    fontSize: '30px'
                                },
                                '& .MuiDayCalendar-header': {
                                    borderTop: '1px solid #D6D6D8',
                                    pt: 1.3,
                                    mb: 0.4
                                },
                                '& .MuiDayCalendar-weekDayLabel': {
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 500,
                                    fontSize: '11px',
                                    color: '#8A8A8A'
                                },
                                '& .MuiPickersDay-root': {
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '24px',
                                    color: '#2E2E2E',
                                    borderRadius: '12px',
                                    width: 50,
                                    height: 38,
                                    margin: '0 2px',
                                    '&:hover': {
                                        bgcolor: '#E9EEF6'
                                    }
                                },
                                '& .MuiPickersDay-root.Mui-selected': {
                                    bgcolor: '#2793EA',
                                    color: '#FFFFFF',
                                    '&:hover': {
                                        bgcolor: '#2793EA'
                                    }
                                },
                                '& .MuiPickersDay-root.Mui-disabled': {
                                    color: '#BBBBBB'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </MuiPaper>
            </Box>

            <Box sx={{ mt: 4.5, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                <Button
                    variant="outlined"
                    onClick={() => setActiveStep(0)}
                    sx={{
                        minWidth: 88,
                        height: 38,
                        borderRadius: '8px',
                        borderColor: '#D2D2D2',
                        color: '#7A7A7A',
                        textTransform: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        '&:hover': {
                            borderColor: '#D2D2D2',
                            bgcolor: '#F8F8F8'
                        }
                    }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={handleStepTwoNext}
                    disabled={!bookingDate}
                    sx={{
                        minWidth: 88,
                        height: 38,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        bgcolor: bookingDate ? '#2E6FD8' : '#B8B8B8',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: bookingDate ? '#2E6FD8' : '#B8B8B8',
                            boxShadow: 'none'
                        }
                    }}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );

    const renderStepThree = () => (
        <Box sx={{ px: 4, py: { xs: 4, md: 2 }, minHeight: 500 }}>
            <Typography
                align="center"
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '34px',
                    fontWeight: 600,
                    color: '#161616',
                    mb: 2.25
                }}
            >
                Select Time Slots
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                    gap: 1.7,
                    width: { xs: '100%', sm: 520 },
                    mx: 'auto',
                    mt: 1.5
                }}
            >
                {timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot;

                    return (
                        <ButtonBase
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            sx={{
                                borderRadius: '12px',
                                border: `1.5px solid ${isSelected ? '#4E88DC' : 'transparent'}`,
                                bgcolor: isSelected ? '#F1F7FF' : '#F3F3F5',
                                minHeight: 72,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.6
                            }}
                        >
                            <AccessTimeOutlinedIcon sx={{ fontSize: 20, color: '#5F6368' }} />
                            <Typography
                                sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#2E2E2E'
                                }}
                            >
                                {slot}
                            </Typography>
                        </ButtonBase>
                    );
                })}
            </Box>

            <Box sx={{ mt: 5.7, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                <Button
                    variant="outlined"
                    onClick={() => setActiveStep(1)}
                    sx={{
                        minWidth: 88,
                        height: 38,
                        borderRadius: '8px',
                        borderColor: '#D2D2D2',
                        color: '#7A7A7A',
                        textTransform: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        '&:hover': {
                            borderColor: '#D2D2D2',
                            bgcolor: '#F8F8F8'
                        }
                    }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={handleStepThreeNext}
                    disabled={isStepThreeNextDisabled}
                    sx={{
                        minWidth: 88,
                        height: 38,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        bgcolor: isStepThreeNextDisabled ? '#B8B8B8' : '#2E6FD8',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: isStepThreeNextDisabled ? '#B8B8B8' : '#2E6FD8',
                            boxShadow: 'none'
                        }
                    }}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );

    const renderStepFour = () => (
        <Box sx={{ px: { xs: 2.5, md: 4 }, py: 3.2, minHeight: 500 }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1.8fr 0.95fr' },
                    gap: { xs: 2.5, lg: 3.2 },
                    alignItems: 'start'
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '34px',
                            fontWeight: 600,
                            color: '#161616',
                            mb: 2.25
                        }}
                    >
                        Add Details
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                            gap: 1.9
                        }}
                    >
                        <TextField
                            label="Client Name"
                            value={clientName}
                            onChange={(event) => setClientName(event.target.value)}
                            onBlur={() => setDetailTouched((prev) => ({ ...prev, clientName: true }))}
                            error={Boolean(detailTouched.clientName && detailErrors.clientName)}
                            helperText={detailTouched.clientName && detailErrors.clientName ? detailErrors.clientName : ' '}
                            required
                            fullWidth
                            sx={fieldSx}
                        />

                        <TextField
                            label="Email Address"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            onBlur={() => setDetailTouched((prev) => ({ ...prev, email: true }))}
                            error={Boolean(detailTouched.email && detailErrors.email)}
                            helperText={detailTouched.email && detailErrors.email ? detailErrors.email : ' '}
                            required
                            fullWidth
                            sx={fieldSx}
                        />

                        <TextField
                            label="Mobile"
                            value={mobile}
                            onChange={(event) => {
                                const numericValue = event.target.value.replace(/\D/g, '');
                                setMobile(numericValue);
                            }}
                            onBlur={() => setDetailTouched((prev) => ({ ...prev, mobile: true }))}
                            error={Boolean(detailTouched.mobile && detailErrors.mobile)}
                            helperText={detailTouched.mobile && detailErrors.mobile ? detailErrors.mobile : ' '}
                            required
                            fullWidth
                            sx={fieldSx}
                        />

                        <TextField
                            label="Service Address"
                            value={serviceAddress}
                            onChange={(event) => setServiceAddress(event.target.value)}
                            onBlur={() => setDetailTouched((prev) => ({ ...prev, serviceAddress: true }))}
                            error={Boolean(detailTouched.serviceAddress && detailErrors.serviceAddress)}
                            helperText={detailTouched.serviceAddress && detailErrors.serviceAddress ? detailErrors.serviceAddress : ' '}
                            required
                            fullWidth
                            sx={fieldSx}
                        />
                    </Box>

                    <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setActiveStep(2)}
                            sx={{
                                minWidth: 88,
                                height: 38,
                                borderRadius: '8px',
                                borderColor: '#D2D2D2',
                                color: '#7A7A7A',
                                textTransform: 'none',
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                '&:hover': {
                                    borderColor: '#D2D2D2',
                                    bgcolor: '#F8F8F8'
                                }
                            }}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleStepFourNext}
                            disabled={!isStepFourValid || !stepFourPayload || isLoading}
                            sx={{
                                minWidth: 88,
                                height: 38,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                bgcolor: isStepFourValid && stepFourPayload && !isLoading ? '#2E6FD8' : '#B8B8B8',
                                boxShadow: 'none',
                                '&:hover': {
                                    bgcolor: isStepFourValid && stepFourPayload && !isLoading ? '#2E6FD8' : '#B8B8B8',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        border: '1px solid #D9D9D9',
                        borderRadius: '14px',
                        bgcolor: '#F4F4F5',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #E1E1E1'
                        }}
                    >
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '30px', fontWeight: 500, color: '#1C1C1C' }}>
                            Booking Details
                        </Typography>
                        <Stack direction="row" spacing={0.7} alignItems="center">
                            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 600, color: '#2D6CC9' }}>
                                Free
                            </Typography>
                            <Switch
                                checked={isFree}
                                onChange={(event) => setIsFree(event.target.checked)}
                                sx={{
                                    width: 50,
                                    height: 28,
                                    p: 0,
                                    '& .MuiSwitch-switchBase': {
                                        p: '4px',
                                        '&.Mui-checked': {
                                            transform: 'translateX(22px)',
                                            color: '#fff',
                                            '& + .MuiSwitch-track': {
                                                backgroundColor: '#2E6FD8',
                                                opacity: 1
                                            }
                                        }
                                    },
                                    '& .MuiSwitch-thumb': {
                                        width: 20,
                                        height: 20
                                    },
                                    '& .MuiSwitch-track': {
                                        borderRadius: 14,
                                        backgroundColor: '#CCD2DB',
                                        opacity: 1
                                    }
                                }}
                            />
                        </Stack>
                    </Box>

                    <Box sx={{ px: 2, py: 1.7, borderBottom: '1px solid #E1E1E1' }}>
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 500, color: '#1F1F1F', mb: 0.5 }}>
                            Service: <Box component="span" sx={{ fontWeight: 600 }}>{selectedCategoryName || '-'}</Box>
                        </Typography>
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 500, color: '#1F1F1F', mb: 0.4 }}>
                            Date: <Box component="span" sx={{ fontWeight: 600 }}>{formattedBookingDate || '-'}</Box>
                        </Typography>
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 500, color: '#1F1F1F' }}>
                            Time: <Box component="span" sx={{ fontWeight: 600 }}>{selectedTime || '-'}</Box>
                        </Typography>
                    </Box>

                    <Box sx={{ px: 2, py: 1.3 }}>
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '30px', fontWeight: 500, color: '#1C1C1C' }}>
                            Total Amount: <Box component="span" sx={{ fontWeight: 700 }}>${amount}</Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    const renderPaymentReceipt = () => (
        <Box sx={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 560,
                    border: '1px solid #D9D9D9',
                    borderRadius: '16px',
                    bgcolor: '#FFFFFF',
                    p: { xs: 2.5, md: 3.2 },
                    boxShadow: '0 6px 20px rgba(17,24,39,0.08)'
                }}
            >
                <Stack spacing={1.1} alignItems="center" sx={{ mb: 2 }}>
                    <CheckCircleRoundedIcon sx={{ color: '#1DB954', fontSize: 42 }} />
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', fontWeight: 600, color: '#111827' }}>
                        Booking Confirmed
                    </Typography>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#6B7280' }}>
                        Thank you. Your payment was processed successfully.
                    </Typography>
                </Stack>

                <Box sx={{ borderTop: '1px solid #ECECEC', borderBottom: '1px solid #ECECEC', py: 1.6, mb: 2 }}>
                    <Stack spacing={1}>
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#374151' }}>
                            Booking ID: <Box component="span" sx={{ fontWeight: 700, color: '#111827' }}>{receiptData?.bookingId || '-'}</Box>
                        </Typography>
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#374151' }}>
                            Transaction ID: <Box component="span" sx={{ fontWeight: 700, color: '#111827' }}>{receiptData?.transactionId || '-'}</Box>
                        </Typography>
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#374151' }}>
                            Paid Amount: <Box component="span" sx={{ fontWeight: 700, color: '#111827' }}>${receiptData?.amount ?? amount}</Box>
                        </Typography>
                    </Stack>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setPaymentSuccess(false);
                            setActiveStep(3);
                        }}
                        sx={{
                            minWidth: 150,
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontFamily: 'Poppins, sans-serif'
                        }}
                    >
                        Back to Details
                    </Button>
                </Box>
            </Box>
        </Box>
    );

    const renderStepFive = () => (
        <Box sx={{ px: { xs: 2.5, md: 4 }, py: 3.2, minHeight: 500 }}>
            {paymentSuccess ? renderPaymentReceipt() : null}
            {!paymentSuccess ? (
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1.8fr 0.95fr' },
                    gap: { xs: 2.5, lg: 3.2 },
                    alignItems: 'start'
                }}
            >
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8, mt: 0.2 }}>
                        <Typography
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '40px',
                                fontWeight: 600,
                                color: '#161616'
                            }}
                        >
                            Make a Payment
                        </Typography>
                        <Stack direction="row" spacing={0.6}>
                            <Box sx={{ px: 0.7, py: 0.35, bgcolor: '#1F77D0', color: '#fff', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>AMEX</Box>
                            <Box sx={{ px: 0.7, py: 0.35, bgcolor: '#151515', color: '#fff', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>MC</Box>
                            <Box sx={{ px: 0.7, py: 0.35, bgcolor: '#2A66DA', color: '#fff', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>VISA</Box>
                            <Box sx={{ px: 0.7, py: 0.35, bgcolor: '#ECECEC', color: '#404040', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>DISC</Box>
                        </Stack>
                    </Box>

                    <Stack spacing={1.45}>
                        <TextField
                            label="CARD NUMBER"
                            value={cardNumber}
                            onChange={(event) => setCardNumber(event.target.value)}
                            onBlur={() => setPaymentTouched((prev) => ({ ...prev, cardNumber: true }))}
                            error={Boolean(paymentTouched.cardNumber && paymentErrors.cardNumber)}
                            helperText={paymentTouched.cardNumber && paymentErrors.cardNumber ? paymentErrors.cardNumber : ' '}
                            placeholder="0000 0000 0000 0000"
                            fullWidth
                            sx={fieldSx}
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                            <TextField
                                label="CARD EXPIRY"
                                value={cardExpiry}
                                onChange={(event) => setCardExpiry(event.target.value)}
                                onBlur={() => setPaymentTouched((prev) => ({ ...prev, cardExpiry: true }))}
                                error={Boolean(paymentTouched.cardExpiry && paymentErrors.cardExpiry)}
                                helperText={paymentTouched.cardExpiry && paymentErrors.cardExpiry ? paymentErrors.cardExpiry : ' '}
                                placeholder="MM / YY"
                                fullWidth
                                sx={fieldSx}
                            />

                            <TextField
                                label="CVV"
                                value={cvv}
                                onChange={(event) => setCvv(event.target.value)}
                                onBlur={() => setPaymentTouched((prev) => ({ ...prev, cvv: true }))}
                                error={Boolean(paymentTouched.cvv && paymentErrors.cvv)}
                                helperText={paymentTouched.cvv && paymentErrors.cvv ? paymentErrors.cvv : ' '}
                                placeholder="123"
                                fullWidth
                                sx={fieldSx}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#B4B4B4', fontWeight: 600 }}>
                                                HELP?
                                            </Typography>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>

                        <TextField
                            label="CARD HOLDER NAME"
                            value={cardHolderName}
                            onChange={(event) => setCardHolderName(event.target.value)}
                            onBlur={() => setPaymentTouched((prev) => ({ ...prev, cardHolderName: true }))}
                            error={Boolean(paymentTouched.cardHolderName && paymentErrors.cardHolderName)}
                            helperText={paymentTouched.cardHolderName && paymentErrors.cardHolderName ? paymentErrors.cardHolderName : ' '}
                            placeholder="Rahul"
                            fullWidth
                            sx={fieldSx}
                        />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mt: 0.2 }}>
                        <CheckCircleRoundedIcon sx={{ color: '#1DB954', fontSize: 20 }} />
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', color: '#1F1F1F', fontWeight: 500 }}>
                            Secure payment
                        </Typography>
                    </Stack>
                </Box>

                <Box>
                    <Box
                        sx={{
                            border: '1px solid #D9D9D9',
                            borderRadius: '14px',
                            bgcolor: '#F4F4F5',
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            sx={{
                                px: 2,
                                py: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #E1E1E1'
                            }}
                        >
                            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '38px', fontWeight: 500, color: '#1C1C1C' }}>
                                Booking Details
                            </Typography>
                            <Stack direction="row" spacing={0.7} alignItems="center">
                                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 600, color: '#2D6CC9' }}>
                                    Free
                                </Typography>
                                <Switch
                                    checked={isFree}
                                    onChange={(event) => setIsFree(event.target.checked)}
                                    sx={{
                                        width: 50,
                                        height: 28,
                                        p: 0,
                                        '& .MuiSwitch-switchBase': {
                                            p: '4px',
                                            '&.Mui-checked': {
                                                transform: 'translateX(22px)',
                                                color: '#fff',
                                                '& + .MuiSwitch-track': {
                                                    backgroundColor: '#2E6FD8',
                                                    opacity: 1
                                                }
                                            }
                                        },
                                        '& .MuiSwitch-thumb': {
                                            width: 20,
                                            height: 20
                                        },
                                        '& .MuiSwitch-track': {
                                            borderRadius: 14,
                                            backgroundColor: '#CCD2DB',
                                            opacity: 1
                                        }
                                    }}
                                />
                            </Stack>
                        </Box>

                        <Box sx={{ px: 2, py: 1.7, borderBottom: '1px solid #E1E1E1' }}>
                            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 500, color: '#1F1F1F', mb: 0.5 }}>
                                Service: <Box component="span" sx={{ fontWeight: 600 }}>{selectedCategoryName || '-'}</Box>
                            </Typography>
                            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 500, color: '#1F1F1F', mb: 0.4 }}>
                                Date: <Box component="span" sx={{ fontWeight: 600 }}>{formattedBookingDate || '-'}</Box>
                            </Typography>
                            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 500, color: '#1F1F1F' }}>
                                Time: <Box component="span" sx={{ fontWeight: 600 }}>{selectedTime || '-'}</Box>
                            </Typography>
                        </Box>

                        <Box sx={{ px: 2, py: 1.3 }}>
                            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '37px', fontWeight: 500, color: '#1C1C1C' }}>
                                Total Amount: <Box component="span" sx={{ fontWeight: 700 }}>${amount}</Box>
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2.2, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setActiveStep(3)}
                            disabled={isProcessingPayment || isLoading}
                            sx={{
                                minWidth: 88,
                                height: 38,
                                borderRadius: '8px',
                                borderColor: '#D2D2D2',
                                color: '#7A7A7A',
                                textTransform: 'none',
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                '&:hover': {
                                    borderColor: '#D2D2D2',
                                    bgcolor: '#F8F8F8'
                                }
                            }}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handlePayment}
                            disabled={!isStepFiveValid || !stepFivePayload || isProcessingPayment || isLoading}
                            sx={{
                                minWidth: 170,
                                height: 38,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                bgcolor: !isStepFiveValid || !stepFivePayload || isProcessingPayment || isLoading ? '#B8B8B8' : '#2E6FD8',
                                boxShadow: 'none',
                                '&:hover': {
                                    bgcolor: !isStepFiveValid || !stepFivePayload || isProcessingPayment || isLoading ? '#B8B8B8' : '#2E6FD8',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            {isProcessingPayment ? (
                                <Stack direction="row" spacing={0.9} alignItems="center">
                                    <CircularProgress size={14} sx={{ color: '#FFFFFF' }} />
                                    <span>Processing Payment...</span>
                                </Stack>
                            ) : `Confirm & Pay $${amount}`}
                        </Button>
                    </Box>

                    {paymentSuccess ? (
                        <Typography sx={{ mt: 1.2, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#17803D' }}>
                            Booking Confirmed
                        </Typography>
                    ) : null}
                </Box>
            </Box>
            ) : null}
        </Box>
    );

    return (
        <Box sx={{ bgcolor: '#F6F6F7', minHeight: '100%', py: 3, fontFamily: 'Poppins, sans-serif' }}>
            <Typography
                align="center"
                sx={{
                    mb: 2.75,
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '20px',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: '#111827'
                }}
            >
                Online Booking Form
            </Typography>

            <Paper
                sx={{
                    maxWidth: 1240,
                    mx: 'auto',
                    pt: 2.2,
                    px: 0,
                    pb: 0,
                    borderRadius: '10px',
                    boxShadow: 'none',
                    border: '1px solid rgba(108, 106, 106, 0.35)',
                    overflow: 'hidden',
                    bgcolor: '#FFFFFF'
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        pb: 2,
                        borderBottom: '1px solid rgba(108, 106, 106, 0.15)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            maxWidth: 700,
                            mx: 'auto',
                            backgroundColor: '#EBEEF4',
                            borderRadius: '999px',
                            padding: '4px',
                            overflow: 'hidden',
                            gap: '2px'
                        }}
                    >
                        {steps.map((label, index) => {
                            const isActive = index <= activeStep;

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        flex: 1,
                                        textAlign: 'center',
                                        padding: '8px 6px',
                                        borderRadius: '999px',
                                        backgroundColor: isActive ? '#4E88DC' : 'transparent',
                                        color: isActive ? '#FFFFFF' : '#808080',
                                        fontWeight: 500,
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        lineHeight: 1.4
                                    }}
                                >
                                    {label}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                <Box
                    key={activeStep}
                    sx={{
                        animation: 'bookingStepFade 180ms ease-in-out',
                        '@keyframes bookingStepFade': {
                            from: { opacity: 0 },
                            to: { opacity: 1 }
                        }
                    }}
                >
                    {activeStep === 0 ? renderStepOne() : null}
                    {activeStep === 1 ? renderStepTwo() : null}
                    {activeStep === 2 ? renderStepThree() : null}
                    {activeStep === 3 ? renderStepFour() : null}
                    {activeStep === 4 ? renderStepFive() : null}
                </Box>
            </Paper>
        </Box>
    );
};

export default BookingForm;