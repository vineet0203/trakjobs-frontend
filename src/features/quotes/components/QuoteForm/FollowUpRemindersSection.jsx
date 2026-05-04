// features/quotes/components/QuoteForm/FollowUpRemindersSection.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Chip,
  Stack,
  TextField
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add,
  Delete,
  NotificationsActive,
  Email,
  AccessTime
} from '@mui/icons-material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import DebouncedSelect from '../../../../components/common/form/DebouncedSelect';
import { REMINDER_TYPES } from '../../constants/quoteConstants';

const FollowUpRemindersSection = ({ formik }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    follow_up_schedule: null,
    reminder_type: 'email',
    reminder_status: 'scheduled'
  });

  const handleAddReminder = () => {
    if (newReminder.follow_up_schedule) {
      const currentReminders = formik.values.reminders || [];
      formik.setFieldValue('reminders', [...currentReminders, {
        ...newReminder,
        id: `temp_${Date.now()}`,
        created_at: new Date()
      }]);
      setNewReminder({
        follow_up_schedule: null,
        reminder_type: 'email',
        reminder_status: 'scheduled'
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveReminder = (index) => {
    const currentReminders = formik.values.reminders || [];
    formik.setFieldValue('reminders', currentReminders.filter((_, i) => i !== index));
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'email': return <Email fontSize="small" />;
      case 'sms': return <NotificationsActive fontSize="small" />;
      default: return <AccessTime fontSize="small" />;
    }
  };

  const reminders = formik.values.reminders || [];

  // Get current date for minDateTime
  const currentDate = new Date();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ flexShrink: 0, mb: 0.5 }}>
        <SectionHeader number="5" title="Follow Ups & Reminders" />
      </Box>

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {!showAddForm ? (
          /* REMINDER LIST VIEW */
          <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {reminders.length === 0 ? (
              /* EMPTY STATE - Center Add Button */
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f9fafb',
                  borderRadius: 2,
                  border: '1px dashed #d1d5db', minHeight: '200px',
                }}
              >
                <NotificationsActive sx={{ fontSize: 32, color: '#9ca3af', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500, mb: 2 }}>
                  No reminders scheduled
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowAddForm(true)}
                  sx={{ textTransform: 'none', px: 3, py: 1 }}
                >
                  Add Reminder
                </Button>
              </Box>
            ) : (
              /* LIST WITH REMINDERS */
              <>
                {/* Header with Plus Icon */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                  flexShrink: 0
                }}>
                  <Typography variant="subtitle2" sx={{ color: '#4b5563', fontWeight: 600 }}>
                    Scheduled Reminders ({reminders.length})
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setShowAddForm(true)}
                    sx={{
                      bgcolor: '#f0f0f0',
                      '&:hover': { bgcolor: '#e0e0e0' }
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>

                {/* Scrollable Reminders List */}
                <Box sx={{
                  flex: 1,
                  overflowY: 'auto',
                  pr: 0.5,
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '10px' },
                  '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '10px' },
                }}>
                  <Stack spacing={1}>
                    {reminders.map((reminder, index) => (
                      <Paper
                        key={reminder.id || index}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          borderColor: '#e5e7eb'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Box sx={{
                              bgcolor: '#eff6ff',
                              borderRadius: 1.5,
                              p: 0.75,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#3b82f6'
                            }}>
                              {getReminderIcon(reminder.reminder_type)}
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {reminder.follow_up_schedule
                                  ? new Date(reminder.follow_up_schedule).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })
                                  : 'Date not set'}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                <Chip
                                  label={reminder.reminder_type}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    height: 18,
                                    '& .MuiChip-label': {
                                      fontSize: '0.75rem',
                                      px: 1,
                                      lineHeight: 1,
                                    },
                                  }}
                                />
                                <Chip
                                  label={reminder.reminder_status}
                                  size="small"
                                  color={reminder.reminder_status === 'scheduled' ? 'warning' : 'success'}
                                  sx={{
                                    height: 18,
                                    '& .MuiChip-label': {
                                      fontSize: '0.75rem',
                                      px: 1,
                                      lineHeight: 1,
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveReminder(index)}
                            sx={{ color: '#9ca3af' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </>
            )}
          </Box>
        ) : (
          /* ADD REMINDER FORM VIEW - Fixed input widths */
          <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Follow Up Schedule Row */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2.5,
              mt: 2,
              width: '100%'
            }}>
              <Typography sx={{
                width: '120px',
                fontSize: '0.9rem',
                color: '#374151',
                fontWeight: 500,
                flexShrink: 0
              }}>
                Schedule On
              </Typography>
              <Box sx={{ width: 'calc(100% - 120px)' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    value={newReminder.follow_up_schedule}
                    onChange={(date) => setNewReminder({ ...newReminder, follow_up_schedule: date })}
                    enableAccessibleFieldDOMStructure={false}
                    minDateTime={currentDate} // This prevents selecting past dates
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: 'MM/DD/YYYY hh:mm aa'
                      }
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            {/* Reminder Type Row - Using original DebouncedSelect */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              width: '100%'
            }}>
              <Typography sx={{
                width: '120px',
                fontSize: '0.9rem',
                color: '#374151',
                fontWeight: 500,
                flexShrink: 0
              }}>
                Reminder Type
              </Typography>
              <Box sx={{ width: 'calc(100% - 120px)' }}>
                <DebouncedSelect
                  value={newReminder.reminder_type}
                  onChange={(value) => setNewReminder({ ...newReminder, reminder_type: value })}
                  options={REMINDER_TYPES}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>

            {/* Form Actions */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1.5,
              mt: 'auto',
            }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowAddForm(false);
                  setNewReminder({
                    follow_up_schedule: null,
                    reminder_type: 'email',
                    reminder_status: 'scheduled'
                  });
                }}
                sx={{ textTransform: 'none', px: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddReminder}
                disabled={!newReminder.follow_up_schedule}
                sx={{ textTransform: 'none', px: 3 }}
              >
                Add Reminder
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default FollowUpRemindersSection;