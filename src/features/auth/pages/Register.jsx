// features/auth/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Button,
  CircularProgress
} from '@mui/material';
import DebouncedTextField from '../../../components/common/form/DebouncedTextField';
import DebouncedSelect from '../../../components/common/form/DebouncedSelect';
import PasswordField from '../../../components/common/form/PasswordField';
import AuthLayout from '../components/ui/AuthLayout';
import { registerSchema } from '../schemas/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import ErrorDialog from '../../../components/common/ErrorDialog';
import {
  MAIN_CATEGORY_OPTIONS,
  SERVICE_CATEGORIES,
  DAYS_OF_WEEK,
  WEEKDAYS,
  ALL_DAYS
} from '../../clients/constants/clientConstants';

const Register = () => {
  const navigate = useNavigate();
  const {
    register: registerUser,
    loading,
    error,
    validationErrors,
    lastErrorCode,
    clearError
  } = useAuth();

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [currentError, setCurrentError] = useState(null);

  // Handle Redux errors - SHOWS DIALOG FOR ALL ERRORS
  useEffect(() => {
    if (error) {
      // Create error object with full details
      const errorObject = {
        response: {
          data: {
            message: error,
            code: lastErrorCode,
            errors: validationErrors,
            timestamp: new Date().toISOString()
          }
        }
      };

      setCurrentError(errorObject);
      setErrorDialogOpen(true);
    }
  }, [error, lastErrorCode, validationErrors]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const availabilityDays =
        values.availability_type === 'mon_fri'
          ? WEEKDAYS
          : values.availability_type === 'full_week'
            ? ALL_DAYS
            : values.availability_days;

      // Send ALL fields to backend
      const registrationData = {
        business_name: values.business_name,
        website_name: values.website_name,
        full_name: values.full_name,
        email: values.email,
        mobile_number: values.mobile_number,
        business_type: values.business_type,
        service_category: values.service_category,
        service_sub_category: values.service_sub_category,
        service_category_custom: values.service_category_custom || null,
        service_sub_category_custom: values.service_sub_category_custom || null,
        availability_type: values.availability_type,
        availability_days: availabilityDays,
        office_start_time: values.office_start_time,
        office_end_time: values.office_end_time,
        password: values.password,
        password_confirmation: values.password_confirmation,
        terms_accepted: values.terms_accepted
      };

      console.log('Sending registration data:', registrationData);

      const result = await registerUser(registrationData);

      if (result) {
        // Navigate to login with success message
        navigate('/auth/login', {
          state: { message: 'Registration successful! Please login to continue.' }
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleErrorAction = (action) => {
    if (action === 'retry') {
      setErrorDialogOpen(false);
      clearError();
    } else if (action === 'contact-support') {
      window.location.href = 'mailto:support@example.com';
    } else if (action === 'login') {
      navigate('/auth/login');
    }
  };

  const sectionCardSx = {
    p: 2.5,
    borderRadius: 2,
    backgroundColor: '#F7F9FC',
    border: '1px solid #E3E8EF'
  };

  const sectionTitleSx = {
    fontWeight: 600,
    color: '#0F2744',
    mb: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '0.75rem'
  };

  return (
    <AuthLayout title="SIGN UP" isRegister>
      {/* Error Dialog for ALL errors */}
      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => {
          setErrorDialogOpen(false);
          clearError();
        }}
        error={currentError}
        onAction={handleErrorAction}
      />

      <Formik
        initialValues={{
          business_name: '',
          website_name: '',
          full_name: '',
          email: '',
          mobile_number: '',
          business_type: '',
          service_category: '',
          service_sub_category: '',
          service_category_custom: '',
          service_sub_category_custom: '',
          availability_type: '',
          availability_days: [],
          office_start_time: '',
          office_end_time: '',
          password: '',
          password_confirmation: '',
          terms_accepted: false,
        }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting, errors, touched, setFieldValue, setFieldTouched, values }) => (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={sectionCardSx}>
                <Typography sx={sectionTitleSx}>Business Details</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <DebouncedTextField
                    name="business_name"
                    label="Business Name"
                    placeholder="Enter your business name"
                    value={values.business_name}
                    onChange={(value) => setFieldValue('business_name', value)}
                    onBlur={() => setFieldTouched('business_name', true)}
                    error={touched.business_name && Boolean(errors.business_name)}
                    helperText={touched.business_name && errors.business_name}
                    required
                    size="medium"
                    disabled={loading}
                  />

                  <DebouncedTextField
                    name="website_name"
                    label="Website Name"
                    placeholder="https://yourcompany.com"
                    value={values.website_name}
                    onChange={(value) => setFieldValue('website_name', value)}
                    onBlur={() => setFieldTouched('website_name', true)}
                    error={touched.website_name && Boolean(errors.website_name)}
                    helperText={touched.website_name && errors.website_name}
                    required
                    size="medium"
                    disabled={loading}
                  />

                  <DebouncedTextField
                    name="full_name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={values.full_name}
                    onChange={(value) => setFieldValue('full_name', value)}
                    onBlur={() => setFieldTouched('full_name', true)}
                    error={touched.full_name && Boolean(errors.full_name)}
                    helperText={touched.full_name && errors.full_name}
                    required
                    size="medium"
                    disabled={loading}
                  />

                  <DebouncedTextField
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="name@company.com"
                    value={values.email}
                    onChange={(value) => setFieldValue('email', value)}
                    onBlur={() => setFieldTouched('email', true)}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    required
                    size="medium"
                    disabled={loading}
                  />

                  <DebouncedTextField
                    name="mobile_number"
                    label="Mobile Number"
                    placeholder="Enter your mobile number"
                    value={values.mobile_number}
                    onChange={(value) => setFieldValue('mobile_number', value)}
                    onBlur={() => setFieldTouched('mobile_number', true)}
                    error={touched.mobile_number && Boolean(errors.mobile_number)}
                    helperText={touched.mobile_number && errors.mobile_number}
                    required
                    size="medium"
                    disabled={loading}
                  />

                  <DebouncedSelect
                    name="business_type"
                    label="Type of Business"
                    value={values.business_type}
                    onChange={(value) => setFieldValue('business_type', value)}
                    options={[
                      { value: 'commercial', label: 'Commercial' },
                      { value: 'residential', label: 'Residential' }
                    ]}
                    error={touched.business_type && Boolean(errors.business_type)}
                    helperText={touched.business_type && errors.business_type}
                    fullWidth
                    required
                    disabled={loading}
                  />
                </Box>
              </Box>

              <Box sx={sectionCardSx}>
                <Typography sx={sectionTitleSx}>Services</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <DebouncedSelect
                    name="service_category"
                    label="Main Service Category"
                    value={values.service_category}
                    onChange={(value) => {
                      setFieldValue('service_category', value);
                      setFieldValue('service_sub_category', '');
                      setFieldValue('service_sub_category_custom', '');
                      if (value !== 'custom') {
                        setFieldValue('service_category_custom', '');
                      }
                    }}
                    options={[
                      ...MAIN_CATEGORY_OPTIONS,
                      { value: 'custom', label: 'Add new main service' }
                    ]}
                    error={touched.service_category && Boolean(errors.service_category)}
                    helperText={touched.service_category && errors.service_category}
                    fullWidth
                    required
                    disabled={loading}
                  />

                  <DebouncedSelect
                    name="service_sub_category"
                    label="Service Subcategory"
                    value={values.service_sub_category}
                    onChange={(value) => {
                      setFieldValue('service_sub_category', value);
                      if (value !== 'custom') {
                        setFieldValue('service_sub_category_custom', '');
                      }
                    }}
                    options={
                      values.service_category && SERVICE_CATEGORIES[values.service_category]
                        ? [
                          ...SERVICE_CATEGORIES[values.service_category].subcategories,
                          { value: 'custom', label: 'Add new sub-service' }
                        ]
                        : values.service_category === 'custom'
                          ? [{ value: 'custom', label: 'Add new sub-service' }]
                          : []
                    }
                    error={touched.service_sub_category && Boolean(errors.service_sub_category)}
                    helperText={touched.service_sub_category && errors.service_sub_category}
                    fullWidth
                    required
                    disabled={!values.service_category || loading}
                  />

                  {values.service_category === 'custom' && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <DebouncedTextField
                        name="service_category_custom"
                        label="New Main Service"
                        placeholder="Enter new main service"
                        value={values.service_category_custom}
                        onChange={(value) => setFieldValue('service_category_custom', value)}
                        onBlur={() => setFieldTouched('service_category_custom', true)}
                        error={touched.service_category_custom && Boolean(errors.service_category_custom)}
                        helperText={touched.service_category_custom && errors.service_category_custom}
                        required
                        size="medium"
                        disabled={loading}
                      />
                    </Box>
                  )}

                  {values.service_sub_category === 'custom' && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <DebouncedTextField
                        name="service_sub_category_custom"
                        label="New Sub-Service"
                        placeholder="Enter new sub-service"
                        value={values.service_sub_category_custom}
                        onChange={(value) => setFieldValue('service_sub_category_custom', value)}
                        onBlur={() => setFieldTouched('service_sub_category_custom', true)}
                        error={touched.service_sub_category_custom && Boolean(errors.service_sub_category_custom)}
                        helperText={touched.service_sub_category_custom && errors.service_sub_category_custom}
                        required
                        size="medium"
                        disabled={loading}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              <Box sx={sectionCardSx}>
                <Typography sx={sectionTitleSx}>Availability</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <DebouncedSelect
                    name="availability_type"
                    label="Availability"
                    value={values.availability_type}
                    onChange={(value) => {
                      setFieldValue('availability_type', value);
                      if (value === 'mon_fri') {
                        setFieldValue('availability_days', WEEKDAYS);
                      } else if (value === 'full_week') {
                        setFieldValue('availability_days', ALL_DAYS);
                      }
                    }}
                    options={[
                      { value: 'mon_fri', label: 'Mon - Fri' },
                      { value: 'full_week', label: 'Full Week' },
                      { value: 'custom', label: 'Custom Days' }
                    ]}
                    error={touched.availability_type && Boolean(errors.availability_type)}
                    helperText={touched.availability_type && errors.availability_type}
                    fullWidth
                    required
                    disabled={loading}
                  />

                  <Box sx={{ gridColumn: '1 / -1' }}>
                    {values.availability_type === 'custom' && (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#4B6274' }}>
                          Select Available Days
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {DAYS_OF_WEEK.map((day) => (
                            <FormControlLabel
                              key={day.value}
                              control={
                                <Checkbox
                                  checked={values.availability_days.includes(day.value)}
                                  onChange={() => {
                                    const nextDays = values.availability_days.includes(day.value)
                                      ? values.availability_days.filter((d) => d !== day.value)
                                      : [...values.availability_days, day.value];
                                    setFieldValue('availability_days', nextDays);
                                    setFieldTouched('availability_days', true);
                                  }}
                                  color="primary"
                                  size="small"
                                />
                              }
                              label={day.label}
                            />
                          ))}
                        </Box>
                        {touched.availability_days && errors.availability_days && (
                          <FormHelperText error sx={{ mt: 0.5 }}>
                            {errors.availability_days}
                          </FormHelperText>
                        )}
                      </Box>
                    )}
                  </Box>

                  <DebouncedTextField
                    name="office_start_time"
                    label="Office Start Time"
                    type="time"
                    value={values.office_start_time}
                    onChange={(value) => setFieldValue('office_start_time', value)}
                    onBlur={() => setFieldTouched('office_start_time', true)}
                    error={touched.office_start_time && Boolean(errors.office_start_time)}
                    helperText={touched.office_start_time && errors.office_start_time}
                    required
                    size="medium"
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                  />

                  <DebouncedTextField
                    name="office_end_time"
                    label="Office End Time"
                    type="time"
                    value={values.office_end_time}
                    onChange={(value) => setFieldValue('office_end_time', value)}
                    onBlur={() => setFieldTouched('office_end_time', true)}
                    error={touched.office_end_time && Boolean(errors.office_end_time)}
                    helperText={touched.office_end_time && errors.office_end_time}
                    required
                    size="medium"
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                  />
                </Box>
              </Box>

              <Box sx={sectionCardSx}>
                <Typography sx={sectionTitleSx}>Security</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <PasswordField
                    name="password"
                    label="Password"
                    placeholder="Create a password"
                    value={values.password}
                    onChange={(e) => setFieldValue('password', e.target.value)}
                    onBlur={() => setFieldTouched('password', true)}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    required
                    size="medium"
                    disabled={loading}
                  />

                  <PasswordField
                    name="password_confirmation"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={values.password_confirmation}
                    onChange={(e) => setFieldValue('password_confirmation', e.target.value)}
                    onBlur={() => setFieldTouched('password_confirmation', true)}
                    error={touched.password_confirmation && Boolean(errors.password_confirmation)}
                    helperText={touched.password_confirmation && errors.password_confirmation}
                    required
                    size="medium"
                    disabled={loading}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.terms_accepted}
                        onChange={(e) => setFieldValue('terms_accepted', e.target.checked)}
                        onBlur={() => setFieldTouched('terms_accepted', true)}
                        color="primary"
                        size="medium"
                        disabled={loading}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Link
                          to="/terms"
                          style={{
                            color: '#1976d2',
                            textDecoration: 'none',
                          }}
                        >
                          Terms & Conditions
                        </Link>
                      </Typography>
                    }
                  />
                  {touched.terms_accepted && errors.terms_accepted && (
                    <FormHelperText error sx={{ mt: 0.5 }}>
                      {errors.terms_accepted}
                    </FormHelperText>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || loading}
                  sx={{
                    textTransform: 'none',
                    fontSize: '18px',
                    minWidth: '220px',
                    position: 'relative',
                    minHeight: '50px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1F4A7A 0%, #2E6D9D 100%)'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={25} color="inherit" />
                  ) : 'Create Vendor Account'}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            style={{
              color: '#1976d2',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Login Now
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default Register;