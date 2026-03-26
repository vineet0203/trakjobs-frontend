import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Switch,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Fade
} from "@mui/material";
import { Close } from "@mui/icons-material";
import DebouncedTextField from "../../../../components/common/form/DebouncedTextField";
import DebouncedSelect from "../../../../components/common/form/DebouncedSelect"; // 👈 Add this import
import CustomDatePicker from "../../../../components/common/CustomDatePicker";

const AddEmployeeModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    dob: "",
    gender: "female",
    email: "",
    mobile: "",
    address: "",
    designation: "",
    department: "",
    reporting_manager: "",
    role: "",
    active: true,
  });

  // Mock options for dropdowns - replace with actual data from API
  const designationOptions = [
    { value: "software_engineer", label: "Software Engineer" },
    { value: "senior_engineer", label: "Senior Engineer" },
    { value: "tech_lead", label: "Tech Lead" },
    { value: "manager", label: "Manager" },
    { value: "director", label: "Director" },
  ];

  const departmentOptions = [
    { value: "engineering", label: "Engineering" },
    { value: "hr", label: "Human Resources" },
    { value: "finance", label: "Finance" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
  ];

  const reportingManagerOptions = [
    { value: "john", label: "John Doe" },
    { value: "jane", label: "Jane Smith" },
    { value: "mike", label: "Mike Johnson" },
    { value: "sarah", label: "Sarah Williams" },
  ];

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = () => {
    console.log("Form Data:", form);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600
        }}
      >
        Add Employee
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          mt: 0,
          maxHeight: '70vh',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '10px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
        }}
      >

        {/* ================= BASIC INFO ================= */}
        <Typography fontWeight={600} mb={2}>
          Basic Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DebouncedTextField
              label="Employee ID"
              placeholder="Enter Employee ID"
              value={form.employee_id}
              onChange={(val) => handleChange("employee_id", val)}
            />
          </Grid>

          <Grid item xs={6}>
            <DebouncedTextField
              label="First Name"
              placeholder="First Name"
              value={form.first_name}
              onChange={(val) => handleChange("first_name", val)}
            />
          </Grid>

          <Grid item xs={6}>
            <DebouncedTextField
              label="Last Name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={(val) => handleChange("last_name", val)}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomDatePicker
              name="dob"
              label="Date of Birth"
              placeholder="DD/MM/YYYY"
              value={form.dob}
              maxDate={new Date()}
              onChange={(val) => handleChange("dob", val)}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <FormLabel sx={{ minWidth: 60, color: 'text.primary' }}>Gender</FormLabel>
              <RadioGroup
                row
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
              </RadioGroup>
            </Box>
          </Grid>
        </Grid>

        {/* ================= CONTACT DETAILS ================= */}
        <Box mt={4}>
          <Typography fontWeight={600} mb={2}>
            Contact Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DebouncedTextField
                label="Email ID"
                placeholder="Enter Email ID"
                value={form.email}
                onChange={(val) => handleChange("email", val)}
              />
            </Grid>

            <Grid item xs={6}>
              <DebouncedTextField
                label="Mobile Number"
                placeholder="Enter Mobile Number"
                value={form.mobile}
                onChange={(val) => handleChange("mobile", val)}
              />
            </Grid>

            <Grid item xs={12}>
              <DebouncedTextField
                label="Address"
                placeholder="Enter Address"
                multiline
                rows={2}
                value={form.address}
                onChange={(val) => handleChange("address", val)}
              />
            </Grid>
          </Grid>
        </Box>

        {/* ================= OFFICIAL DETAILS ================= */}
        <Box mt={4} mb={2}>
          <Typography fontWeight={600} mb={2}>
            Official Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DebouncedSelect
                label="Designation"
                placeholder="Select Designation"
                value={form.designation}
                onChange={(val) => handleChange("designation", val)}
                options={designationOptions}
                fullWidth
                size="medium"
              />
            </Grid>

            <Grid item xs={6}>
              <DebouncedSelect
                label="Department"
                placeholder="Select Department"
                value={form.department}
                onChange={(val) => handleChange("department", val)}
                options={departmentOptions}
                fullWidth
                size="medium"
              />
            </Grid>

            <Grid item xs={6}>
              <DebouncedSelect
                label="Reporting Manager"
                placeholder="Select Reporting Manager"
                value={form.reporting_manager}
                onChange={(val) => handleChange("reporting_manager", val)}
                options={reportingManagerOptions}
                fullWidth
                size="medium"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* Footer with Role and Active on left, buttons on right */}
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2
        }}
      >
        {/* Left side - Role and Active */}
        <Box display="flex" alignItems="center">
          <Typography sx={{ minWidth: 45, fontWeight: 500 }}>Role:</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Switch
              checked={form.active}
              onChange={(e) => handleChange("active", e.target.checked)}
              size="small"
            />
            <Typography>Active</Typography>
          </Box>
        </Box>

        {/* Right side - Buttons */}
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              textTransform: "none",
              px: 3
            }}
          >
            Save & Continue
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddEmployeeModal;