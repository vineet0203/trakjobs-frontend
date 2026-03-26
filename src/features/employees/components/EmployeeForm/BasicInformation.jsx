// features/employees/components/EmployeeForm/BasicInformation.jsx
import React from "react";
import { Grid, Box, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import DebouncedTextField from "../../../../components/common/form/DebouncedTextField";
import CustomDatePicker from "../../../../components/common/CustomDatePicker";

const BasicInformation = ({ formik, mode = "create" }) => {
  return (
    <Grid container spacing={2}>
      {/* First Name */}
      <Grid item xs={6}>
        <DebouncedTextField
          name="first_name"
          label="First Name"
          placeholder="First Name"
          value={formik.values.first_name}
          onChange={(val) => formik.setFieldValue("first_name", val)}
          onBlur={formik.handleBlur}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
          fullWidth
          required
        />
      </Grid>

      {/* Last Name */}
      <Grid item xs={6}>
        <DebouncedTextField
          name="last_name"
          label="Last Name"
          placeholder="Last Name"
          value={formik.values.last_name}
          onChange={(val) => formik.setFieldValue("last_name", val)}
          onBlur={formik.handleBlur}
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
          fullWidth
        />
      </Grid>

      {/* Date of Birth */}
      <Grid item xs={6}>
        <CustomDatePicker
          name="date_of_birth"
          label="Date of Birth"
          placeholder="DD/MM/YYYY"
          value={formik.values.date_of_birth}
          maxDate={new Date()}
          onChange={(val) => formik.setFieldValue("date_of_birth", val)}
          onBlur={() => formik.setFieldTouched("date_of_birth", true, true)}
          error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
          helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
          required
        />
      </Grid>

      {/* Gender - Fixed vertical alignment */}
      <Grid item xs={6}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            height: '56px', // Match MUI TextField height (56px)
            width: '100%',
            borderBottom: '1px solid transparent', // Invisible border for alignment
          }}
        >
          <FormLabel 
            sx={{ 
              minWidth: 70, // Slightly wider for better spacing
              color: 'text.primary',
              fontWeight: 500,
              fontSize: '0.875rem', // Match MUI InputLabel font size
              transform: 'translateY(-2px)', // Fine-tune vertical alignment
            }}
          >
            Gender
          </FormLabel>
          <RadioGroup
            row
            name="gender"
            value={formik.values.gender}
            onChange={(e) => {
              formik.setFieldValue("gender", e.target.value);
              formik.setFieldTouched("gender", true);
            }}
            onBlur={formik.handleBlur}
            sx={{ 
              ml: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FormControlLabel 
              value="male" 
              control={<Radio size="small" sx={{ py: 1 }} />} 
              label="Male" 
              sx={{ 
                mr: 2,
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.875rem',
                }
              }}
            />
            <FormControlLabel 
              value="female" 
              control={<Radio size="small" sx={{ py: 1 }} />} 
              label="Female"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.875rem',
                }
              }}
            />
          </RadioGroup>
        </Box>
        {/* Error message positioned below */}
        {formik.touched.gender && formik.errors.gender && (
          <Box 
            sx={{ 
              color: 'error.main', 
              fontSize: '0.75rem', 
              mt: 0.5, 
              ml: 7,
              minHeight: '20px', // Reserve space for error message
            }}
          >
            {formik.errors.gender}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default BasicInformation;