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
  DAYS_OF_WEEK,
  WEEKDAYS,
  ALL_DAYS,
  SERVICE_CATEGORIES
} from '../../clients/constants/clientConstants';
import { categoryService } from '../../../services/categoryService';
import axios from 'axios';

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
  const [services, setServices] = useState([]);
  const [serviceCategories, setServiceCategories] = useState({});
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);

  // Fetch service categories from API
  useEffect(() => {
    const loadServiceCategories = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.trakjobs.com";
        const res = await axios.get(`${apiBaseUrl}/api/v1/public/service-categories`);
        
        if (res.data && res.data.success) {
          const categories = res.data.data;
          const categoryMap = {};
          const mainOptions = [];

          categories.forEach(cat => {
            categoryMap[cat.slug] = {
              label: cat.name,
              subcategories: cat.service_sub_categories ? cat.service_sub_categories.map(sub => ({
                value: sub.slug,
                label: sub.name
              })) : []
            };
            mainOptions.push({
              value: cat.slug,
              label: cat.name
            });
          });

          setServiceCategories(categoryMap);
          setMainCategoryOptions(mainOptions);
        }
      } catch (err) {
        console.warn("Failed to fetch service categories", err);
      }
    };
    loadServiceCategories();
  }, []);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
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
        terms_accepted: values.terms_accepted,
        service_ids: values.service_ids || []
      };

      console.log('Sending registration data:', registrationData);
      const result = await registerUser(registrationData);

      if (result) {
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
          service_ids: [],
        }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting, errors, touched, setFieldValue, setFieldTouched, values }) => (
          <Form>
            {/* Your existing form fields go here */}
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Register;
