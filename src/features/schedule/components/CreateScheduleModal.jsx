import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Grid,
  Divider,
  Fade,
  CircularProgress,
  Switch,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useToast } from "../../../components/common/ToastProvider";
import CustomDatePicker from "../../../components/common/CustomDatePicker";
import QuickTimePicker from "../../../components/common/QuickTimePicker";
import scheduleService from "../services/scheduleService";
import jobService from "../../jobs/services/jobService";
import employeeService from "../../employees/services/employeeService";
import {
  PRIORITY_OPTIONS,
  INITIAL_SCHEDULE_VALUES,
} from "../constants/scheduleConstants";

const scheduleValidationSchema = Yup.object({
  job_id: Yup.number().required("Job is required"),
  start_date: Yup.string().required("Start date is required"),
  start_time: Yup.string().required("Start time is required"),
  end_date: Yup.string()
    .required("End date is required")
    .test("end-not-before-start", "End date cannot be before start date", function (value) {
      const { start_date } = this.parent;
      if (!start_date || !value) return true;
      return value >= start_date;
    }),
  end_time: Yup.string()
    .required("End time is required")
    .test("end-after-start", "End time must be after start time on the same day", function (value) {
      const { start_date, end_date, start_time } = this.parent;
      if (!start_date || !end_date || !start_time || !value) return true;
      if (end_date > start_date) return true; // different days — any time is fine
      return value > start_time;
    })
    .test("min-duration", "Schedule must be at least 15 minutes long", function (value) {
      const { start_date, end_date, start_time } = this.parent;
      if (!start_date || !end_date || !start_time || !value) return true;
      const start = new Date(`${start_date}T${start_time}`);
      const end = new Date(`${end_date}T${value}`);
      return (end - start) >= 15 * 60 * 1000;
    }),
  priority: Yup.string()
    .oneOf(["normal", "high", "emergency"])
    .required("Priority is required"),
  crew_id: Yup.number().nullable(),
  notes: Yup.string().max(2000, "Notes cannot exceed 2000 characters").nullable(),
  address: Yup.string().max(500, "Address cannot exceed 500 characters").nullable(),
});

const CreateScheduleModal = ({
  open,
  onClose,
  jobData = null, // Prefilled when opened from Job Details
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const fetchedRef = useRef(false);

  const isFromJobDetails = !!jobData;

  const extractAddress = (job) => {
    if (!job) return "";
    let parts = [job.address_line_1, job.city, job.state, job.zip_code].filter(Boolean);
    if (parts.length === 0 && job.client) {
      parts = [job.client.address_line_1, job.client.city, job.client.state, job.client.zip_code].filter(Boolean);
    }
    return parts.join(", ");
  };

  // Build initial values based on context
  const getInitialValues = () => {
    if (jobData) {
      return {
        ...INITIAL_SCHEDULE_VALUES,
        job_id: jobData.id,
        address: extractAddress(jobData),
      };
    }
    return { ...INITIAL_SCHEDULE_VALUES, address: "" };
  };

  // Fetch jobs and employees when modal opens
  useEffect(() => {
    if (open && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchEmployees();
      if (!isFromJobDetails) {
        fetchJobs();
      } else {
        setSelectedJob(jobData);
      }
    }
    if (!open) {
      fetchedRef.current = false;
      setSelectedJob(isFromJobDetails ? jobData : null);
      setSubmitAction(null);
    }
  }, [open, isFromJobDetails, jobData]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await jobService.getAll({ per_page: 100 });
      setJobs(response.data || []);
    } catch (error) {
      showToast("Failed to load jobs", "error");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await employeeService.getAll({ per_page: 100 });
      setEmployees(response.data || []);
    } catch (error) {
      showToast("Failed to load employees", "error");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      // Build datetime strings
      const startDatetime = `${values.start_date}T${values.start_time}:00`;
      const endDatetime = `${values.end_date}T${values.end_time}:00`;

      const payload = {
        job_id: values.job_id,
        crew_id: values.crew_id || null,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        priority: values.priority,
        status: submitAction === "draft" ? "draft" : "scheduled",
        notes: values.notes || null,
        address: values.address || null,
        is_multi_day: values.is_multi_day,
        is_recurring: values.is_recurring,
        notify_client: values.notify_client,
        notify_crew: values.notify_crew,
      };

      await scheduleService.create(payload);

      const successMsg =
        submitAction === "draft"
          ? "Schedule saved as draft"
          : "Schedule created successfully";
      showToast(successMsg, "success");

      resetForm();
      onClose();
      onSuccess?.();
    } catch (error) {
      const data = error.response?.data;
      // Surface field-level validation errors from backend
      if (data?.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        showToast(firstError || "Validation failed", "error");
      } else {
        showToast(data?.message || "Failed to create schedule", "error");
      }
    } finally {
      setIsSubmitting(false);
      setSubmitAction(null);
    }
  };

  const handleSaveClick = async (formikProps, action) => {
    setSubmitAction(action);

    const errors = await formikProps.validateForm();
    const touched = {};
    Object.keys(formikProps.values).forEach((key) => {
      touched[key] = true;
    });
    formikProps.setTouched(touched);

    if (Object.keys(errors).length === 0) {
      formikProps.submitForm();
    } else {
      setIsSubmitting(false);
      setSubmitAction(null);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleJobChange = (jobId, formikProps) => {
    formikProps.setFieldValue("job_id", jobId);
    const job = jobs.find((j) => j.id === jobId);
    setSelectedJob(job || null);
    if (job) {
      formikProps.setFieldValue("address", extractAddress(job));
    }
  };

  const getClientName = () => {
    if (selectedJob?.client_name) return selectedJob.client_name;
    if (selectedJob?.client?.name) return selectedJob.client.name;
    if (selectedJob?.client?.company_name) return selectedJob.client.company_name;
    if (selectedJob?.client)
      return `${selectedJob.client.first_name || ""} ${selectedJob.client.last_name || ""}`.trim();
    return "—";
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        sx: {
          width: { xs: "96vw", md: "92vw", lg: "1120px" },
          maxWidth: "1120px",
          borderRadius: 3,
          py: 0,
          px: 2,
          minHeight: "600px",
        },
      }}
    >
      <Formik
        initialValues={getInitialValues()}
        validationSchema={scheduleValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnChange={true}
        validateOnBlur={true}
      >
        {(formikProps) => {
          const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched } = formikProps;

          return (
            <Form>
              {/* Header */}
              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                Create Schedule
                <IconButton onClick={handleClose} disabled={isSubmitting}>
                  <Close />
                </IconButton>
              </DialogTitle>

              <Divider />

              <DialogContent
                sx={{
                  mt: 0,
                  height: "70vh",
                  minHeight: "450px",
                  overflow: "auto",
                  position: "relative",
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#c1c1c1",
                    borderRadius: "10px",
                    "&:hover": { background: "#a8a8a8" },
                  },
                }}
              >
                {/* ====== JOB INFORMATION ====== */}
                <Typography fontWeight={600} mb={2}>
                  Job Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {isFromJobDetails ? (
                      <TextField
                        fullWidth
                        label="Job"
                        value={
                          jobData
                            ? `${jobData.job_number || ""} - ${jobData.title || ""}`
                            : ""
                        }
                        InputProps={{ readOnly: true }}
                        size="small"
                        sx={{ "& .MuiInputBase-root": { backgroundColor: "#f5f5f5" } }}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        select
                        label="Select Job *"
                        name="job_id"
                        value={values.job_id}
                        onChange={(e) =>
                          handleJobChange(Number(e.target.value), formikProps)
                        }
                        onBlur={handleBlur}
                        error={touched.job_id && Boolean(errors.job_id)}
                        helperText={touched.job_id && errors.job_id}
                        size="small"
                        disabled={loadingJobs}
                      >
                        {loadingJobs ? (
                          <MenuItem disabled>Loading jobs...</MenuItem>
                        ) : (
                          jobs.map((job) => (
                            <MenuItem key={job.id} value={job.id}>
                              {job.job_number} - {job.title}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Client"
                      value={selectedJob ? getClientName() : "—"}
                      InputProps={{ readOnly: true }}
                      size="small"
                      sx={{ "& .MuiInputBase-root": { backgroundColor: "#f5f5f5" } }}
                    />
                  </Grid>
                  {selectedJob?.work_type && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Service Type"
                        value={selectedJob.work_type?.replace(/_/g, " ") || "—"}
                        InputProps={{ readOnly: true }}
                        size="small"
                        sx={{
                          "& .MuiInputBase-root": { backgroundColor: "#f5f5f5" },
                          textTransform: "capitalize",
                        }}
                      />
                    </Grid>
                  )}
                </Grid>

                {/* ====== LOCATION ====== */}
                <Box mt={4}>
                  <Typography fontWeight={600} mb={2}>
                    Location
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={values.address || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        size="small"
                        placeholder="Enter location address..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          height: 250,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 2,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <iframe
                          title="Location Map"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(values.address || 'Maharashtra, India')}&output=embed`}
                          allowFullScreen
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* ====== PRIORITY ====== */}
                <Box mt={4}>
                  <Typography fontWeight={600} mb={2}>
                    Priority
                  </Typography>
                  <Box display="flex" gap={1}>
                    {PRIORITY_OPTIONS.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={
                          values.priority === opt.value
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => setFieldValue("priority", opt.value)}
                        size="small"
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          px: 3,
                          ...(values.priority === opt.value && opt.value === "normal"
                            ? { backgroundColor: "#2E7D32", "&:hover": { backgroundColor: "#1B5E20" } }
                            : {}),
                          ...(values.priority === opt.value && opt.value === "high"
                            ? { backgroundColor: "#E65100", "&:hover": { backgroundColor: "#BF360C" } }
                            : {}),
                          ...(values.priority === opt.value && opt.value === "emergency"
                            ? { backgroundColor: "#C62828", "&:hover": { backgroundColor: "#B71C1C" } }
                            : {}),
                        }}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </Box>
                  {touched.priority && errors.priority && (
                    <Typography variant="caption" color="error" mt={0.5}>
                      {errors.priority}
                    </Typography>
                  )}
                </Box>

                {/* ====== DATE & TIME ====== */}
                <Box mt={4}>
                  <Typography fontWeight={600} mb={2}>
                    Date & Time
                  </Typography>
                  {/* Row 1: Dates */}
                  <Grid container spacing={2} mb={1.5}>
                    <Grid item xs={12} sm={6}>
                      <CustomDatePicker
                        label="Start Date *"
                        name="start_date"
                        placeholder="DD/MM/YYYY"
                        value={values.start_date}
                        onChange={(value) => setFieldValue("start_date", value)}
                        onBlur={() => setFieldTouched("start_date", true, true)}
                        error={touched.start_date && Boolean(errors.start_date)}
                        helperText={touched.start_date && errors.start_date}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomDatePicker
                        label="End Date *"
                        name="end_date"
                        placeholder="DD/MM/YYYY"
                        value={values.end_date}
                        minDate={values.start_date || null}
                        onChange={(value) => {
                          setFieldValue("end_date", value);
                          if (values.start_date && value !== values.start_date) {
                            setFieldValue("is_multi_day", true);
                          }
                        }}
                        onBlur={() => setFieldTouched("end_date", true, true)}
                        error={touched.end_date && Boolean(errors.end_date)}
                        helperText={touched.end_date && errors.end_date}
                        required
                      />
                    </Grid>
                  </Grid>

                  {/* Row 2: Times */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <QuickTimePicker
                        label="Start Time *"
                        name="start_time"
                        value={values.start_time}
                        onChange={(value) => setFieldValue("start_time", value)}
                        onBlur={() => setFieldTouched("start_time", true, true)}
                        error={touched.start_time && Boolean(errors.start_time)}
                        helperText={touched.start_time && errors.start_time}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <QuickTimePicker
                        label="End Time *"
                        name="end_time"
                        value={values.end_time}
                        onChange={(value) => setFieldValue("end_time", value)}
                        onBlur={() => setFieldTouched("end_time", true, true)}
                        error={touched.end_time && Boolean(errors.end_time)}
                        helperText={touched.end_time && errors.end_time}
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* ====== SCHEDULE OPTIONS ====== */}
                <Box mt={4}>
                  <Typography fontWeight={600} mb={2}>
                    Schedule Options
                  </Typography>
                  <Box display="flex" gap={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.is_multi_day}
                          onChange={(e) =>
                            setFieldValue("is_multi_day", e.target.checked)
                          }
                          size="small"
                        />
                      }
                      label="Multi-day job"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.is_recurring}
                          onChange={(e) =>
                            setFieldValue("is_recurring", e.target.checked)
                          }
                          size="small"
                        />
                      }
                      label="Recurring schedule"
                    />
                  </Box>
                </Box>

                {/* ====== CREW ASSIGNMENT ====== */}
                <Box mt={4}>
                  <Typography fontWeight={600} mb={2}>
                    Crew Assignment
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Assign Crew Member"
                        name="crew_id"
                        value={values.crew_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.crew_id && Boolean(errors.crew_id)}
                        helperText={touched.crew_id && errors.crew_id}
                        size="small"
                        disabled={loadingEmployees}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {loadingEmployees ? (
                          <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                          employees.map((emp) => (
                            <MenuItem key={emp.id} value={emp.id}>
                              {emp.first_name} {emp.last_name}
                              {emp.designation ? ` — ${emp.designation}` : ""}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    </Grid>
                    {values.crew_id && (
                      <Grid item xs={12} sm={6}>
                        {(() => {
                          const selected = employees.find(
                            (e) => e.id === Number(values.crew_id)
                          );
                          if (!selected) return null;
                          return (
                            <Box
                              sx={{
                                p: 1.5,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 2,
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              <Typography variant="body2" fontWeight={500}>
                                {selected.first_name} {selected.last_name}
                              </Typography>
                              {selected.designation && (
                                <Typography variant="caption" color="text.secondary">
                                  {selected.designation}
                                </Typography>
                              )}
                            </Box>
                          );
                        })()}
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* ====== NOTIFICATIONS ====== */}
                <Box mt={4}>
                  <Typography fontWeight={600} mb={2}>
                    Notifications
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.notify_client}
                          onChange={(e) =>
                            setFieldValue("notify_client", e.target.checked)
                          }
                          size="small"
                        />
                      }
                      label="Send confirmation to client"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.notify_crew}
                          onChange={(e) =>
                            setFieldValue("notify_crew", e.target.checked)
                          }
                          size="small"
                        />
                      }
                      label="Send reminder to crew"
                    />
                  </Box>
                </Box>

                {/* ====== NOTES ====== */}
                <Box mt={4} mb={2}>
                  <Typography fontWeight={600} mb={2}>
                    Notes
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Instructions / Notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.notes && Boolean(errors.notes)}
                    helperText={touched.notes && errors.notes}
                    size="small"
                    placeholder="Add any special instructions or notes for this schedule..."
                  />
                </Box>
              </DialogContent>

              <Divider />

              {/* Footer */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  px: 3,
                  py: 1.5,
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveClick(formikProps, "draft")}
                  sx={{ textTransform: "none" }}
                >
                  {isSubmitting && submitAction === "draft" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Save as Draft"
                  )}
                </Button>
                <Button
                  variant="contained"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveClick(formikProps, "schedule")}
                  sx={{ textTransform: "none", px: 3 }}
                >
                  {isSubmitting && submitAction === "schedule" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Save & Schedule"
                  )}
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default CreateScheduleModal;
