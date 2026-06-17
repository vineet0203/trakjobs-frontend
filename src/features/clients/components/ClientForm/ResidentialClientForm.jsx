// features/clients/components/ClientForm/ResidentialClientForm.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';
import DebouncedSelect from '../../../../components/common/form/DebouncedSelect'; // <-- add
import CommonContactFields from './CommonContactFields';
import CommonAddressFields from './CommonAddressFields';
import {
  TAX_APPLICABLE_OPTIONS,
  TAX_PERCENTAGE_OPTIONS,
  MAIN_CATEGORY_OPTIONS,
  SERVICE_CATEGORIES
} from '../../constants/clientConstants'; // <-- add
import { categoryService } from '../../../../services/categoryService';

const ResidentialClientForm = ({ formik }) => {
  const [rawCategories, setRawCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState(MAIN_CATEGORY_OPTIONS);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.fetchCategories();
        if (data && data.length > 0) {
          setRawCategories(data);
          setCategoryOptions(data.map(c => ({ value: c.slug, label: c.name })));
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic categories, using hardcoded fallback", err);
      }
    };
    loadCategories();
  }, []);

  const selectedMainCategory = formik.values.service_category;

  useEffect(() => {
    const loadSubCategories = async () => {
      if (!selectedMainCategory) {
        setSubcategoryOptions([]);
        return;
      }
      
      const catObj = rawCategories.find(c => c.slug === selectedMainCategory);
      if (catObj) {
        try {
          const subs = await categoryService.fetchSubCategories(catObj.id);
          setSubcategoryOptions(subs);
          return;
        } catch (err) {
          console.warn("Failed to fetch dynamic subcategories, falling back to static", err);
        }
      }
      
      // Fallback
      const staticOptions = SERVICE_CATEGORIES[selectedMainCategory]
        ? SERVICE_CATEGORIES[selectedMainCategory].subcategories
        : [];
      setSubcategoryOptions(staticOptions);
    };

    loadSubCategories();
  }, [selectedMainCategory, rawCategories]);

  return (
    <>
      {/* Personal Details */}
      <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}>
        <SectionHeader number="1" title="Personal Details" />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DebouncedTextField
              name="first_name"
              label="First Name"
              value={formik.values.first_name}
              onChange={(val) => formik.setFieldValue('first_name', val)}
              onBlur={formik.handleBlur}
              required
              error={formik.touched.first_name && formik.errors.first_name}
              helperText={formik.touched.first_name && formik.errors.first_name}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DebouncedTextField
              name="last_name"
              label="Last Name"
              value={formik.values.last_name}
              onChange={(val) => formik.setFieldValue('last_name', val)}
              onBlur={formik.handleBlur}
              error={formik.touched.last_name && formik.errors.last_name}
              helperText={formik.touched.last_name && formik.errors.last_name}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Information */}
      <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}>
        <SectionHeader number="2" title="Contact Information" />
        <Grid container spacing={3}>
          <CommonContactFields formik={formik} />
        </Grid>
      </Paper>

      {/* Address */}
      <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}>
        <SectionHeader number="3" title="Address" />
        <Grid container spacing={3}>
          <CommonAddressFields formik={formik} />
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}>
        <SectionHeader number="4" title="Tax Preferences" />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
              <Typography sx={{ fontWeight: 500 }}>Apply Tax?</Typography>
              <DebouncedSelect
                name="is_tax_applicable"
                label=""
                value={formik.values.is_tax_applicable}
                onChange={(value) => {
                  const isTaxApplicable = value === true || value === 'true';
                  formik.setFieldValue('is_tax_applicable', isTaxApplicable);
                  if (!isTaxApplicable) {
                    formik.setFieldValue('tax_percentage', '0');
                  }
                }}
                options={TAX_APPLICABLE_OPTIONS}
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <DebouncedSelect
              name="tax_percentage"
              label="Tax Percentage"
              value={formik.values.tax_percentage}
              onChange={(value) => formik.setFieldValue('tax_percentage', value)}
              options={TAX_PERCENTAGE_OPTIONS}
              disabled={!formik.values.is_tax_applicable}
              error={formik.touched.tax_percentage && formik.errors.tax_percentage}
              helperText={formik.touched.tax_percentage && formik.errors.tax_percentage}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 0, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}
      >
        <SectionHeader number="5" title="Service Category" />

        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <DebouncedSelect
              name="service_category"
              label="Main Service Category"
              value={formik.values.service_category}
              onChange={(value) => {
                formik.setFieldValue('service_category', value);
                formik.setFieldValue('service_sub_category', ''); // Reset subcategory when main changes
              }}
              options={categoryOptions}
              error={
                formik.touched.service_category &&
                formik.errors.service_category
              }
              helperText={
                formik.touched.service_category &&
                formik.errors.service_category
              }
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DebouncedSelect
              name="service_sub_category"
              label="Service Subcategory"
              value={formik.values.service_sub_category}
              onChange={(value) => formik.setFieldValue('service_sub_category', value)}
              options={subcategoryOptions}
              error={formik.touched.service_sub_category && formik.errors.service_sub_category}
              helperText={formik.touched.service_sub_category && formik.errors.service_sub_category}
              fullWidth
              required
              disabled={!selectedMainCategory}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ResidentialClientForm;