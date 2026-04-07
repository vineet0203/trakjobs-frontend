// src/pages/Jobs/JobDetails.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, CircularProgress, Box, Typography, Button } from '@mui/material';
import { useToast } from '../../../components/common/ToastProvider';
import { useJobs } from '../../../features/jobs/hooks/useJobs';
import PageHeader from '../../../components/common/PageHeader';
import JobActionMenu from '../components/JobView/JobActionMenu';
import JobDetailsSection from '../components/JobView/JobDetailsSection';
import AttachmentsSection from '../components/JobView/AttachmentsSection';
import TasksSection from '../components/JobView/TasksSection';
import InstructionsSection from '../components/JobView/InstructionsSection';
import HeaderActions from '../components/JobView/HeaderActions';
import AssignJobModal from '../components/JobView/AssignJobModal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [localTasks, setLocalTasks] = useState([]);
  const [localAttachments, setLocalAttachments] = useState({
    general: [],
    instructions: []
  });

  const {
    currentJob,
    loading,
    getJob,
    deleteJob,
    changeJobStatus,
    addTask,
    toggleTask,
    deleteTask,
    addAttachment,
    deleteAttachment,
    updateJob,
    clearCurrent,
  } = useJobs({ autoFetch: false });

  // Update local state when currentJob changes
  useEffect(() => {
    if (currentJob) {
      setLocalTasks(currentJob.tasks || []);
      setLocalAttachments({
        general: currentJob.attachments_by_context?.general || [],
        instructions: currentJob.attachments_by_context?.instructions || []
      });
    }
  }, [currentJob]);

  // Fetch job details
  useEffect(() => {
    if (id) {
      getJob(id);
    }

    return () => {
      clearCurrent();
    };
  }, [id, getJob, clearCurrent]);

  const handleEdit = () => {
    navigate(`/jobs/${id}/edit`);
  };

  const saveJob = async () => {
    if (!currentJob) return;
    setSaving(true);
    try {
      await updateJob(id, {
        title: currentJob.title,
        status: currentJob.status,
      });
      showToast('Job updated successfully', 'success');
      navigate('/jobs');
    } catch (error) {
      showToast('Failed to save job', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openAssignModal = () => {
    setAssignModalOpen(true);
  };

  const handleJobAssigned = () => {
    getJob(id);
  };

  const handleUpdateJob = async (data) => {
    try {
      await updateJob(id, data);
      //showToast('Job updated successfully', 'success');
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleDelete = async () => {
    try {
      await deleteJob(id);
      showToast('Job deleted successfully', 'success');
      navigate('/jobs');
    } catch (error) {
      // Error is already handled in the hook
    }
    setDeleteDialogOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard', 'info');
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await changeJobStatus(id, newStatus);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await addTask(id, taskData);
      // Refetch job to ensure we have the latest data
      await getJob(id);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleToggleTask = async (taskId) => {
    const task = localTasks.find(t => t.id === taskId);
    if (task) {
      try {
        await toggleTask(id, taskId, task.completed);
        // Refetch job to ensure we have the latest data
        await getJob(id);
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(id, taskId);
      // Update local state immediately
      setLocalTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleEditTask = async (taskId, taskData) => {
    // If you have an edit task API endpoint, implement it here
    // For now, we'll just show a toast
    showToast('Edit task functionality coming soon', 'info');
  };

  const handleAddGeneralAttachment = async (file) => {
    try {
      await addAttachment(id, file, file.name, { context: 'general' });
      // Refetch job to ensure we have the latest data
      await getJob(id);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleAddInstructionAttachment = async (file) => {
    try {
      await addAttachment(id, file, file.name, { context: 'instructions' });
      // Refetch job to ensure we have the latest data
      await getJob(id);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    // Find which context the attachment belongs to
    let context = 'general';
    if (localAttachments.instructions.some(a => a.id === attachmentId)) {
      context = 'instructions';
    }

    try {
      await deleteAttachment(id, attachmentId, context);
      // Update local state immediately
      setLocalAttachments(prev => ({
        ...prev,
        [context]: prev[context].filter(a => a.id !== attachmentId)
      }));
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleDownloadAttachment = (attachment) => {
    if (attachment?.url) {
      window.open(attachment.url, '_blank');
    }
  };

  const handlePreviewAttachment = (attachment) => {
    if (attachment?.url) {
      window.open(attachment.url, '_blank');
    }
  };

  if (loading && !currentJob) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentJob && !loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Job not found</Typography>
        <Button variant="contained" onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        title={currentJob?.title || ''}
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Jobs', path: '/jobs' },
          { label: currentJob?.job_number || '', current: true }
        ]}

        actions={
          <>
            <HeaderActions
              onSave={saveJob}
              onAssignJob={openAssignModal}
              saving={saving}
            />
            <JobActionMenu
              status={currentJob?.status}
              onEdit={handleEdit}
              onDelete={() => setDeleteDialogOpen(true)}
              onPrint={handlePrint}
              onShare={handleShare}
              onStatusChange={handleUpdateStatus}
            />
          </>
        }
      />

      <JobDetailsSection jobData={currentJob} onUpdateJob={handleUpdateJob} />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <InstructionsSection
            instructions={currentJob?.instructions}
            attachments={localAttachments.instructions}
            onAddAttachment={handleAddInstructionAttachment}
            onDeleteAttachment={handleDeleteAttachment}
            onDownload={handleDownloadAttachment}
            onUpdate={handleUpdateJob}
            jobId={id}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TasksSection
            tasks={localTasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AttachmentsSection
            attachments={localAttachments.general}
            onAddAttachment={() => document.getElementById('general-file-upload').click()}
            onDownload={handleDownloadAttachment}
            onPreview={handlePreviewAttachment}
            onDelete={handleDeleteAttachment}
          />
        </Grid>
      </Grid>

      <input
        type="file"
        id="general-file-upload"
        style={{ display: 'none' }}
        multiple
        onChange={(e) => {
          if (e.target.files?.length > 0) {
            Array.from(e.target.files).forEach(file => {
              handleAddGeneralAttachment(file);
            });
          }
          // Reset input
          e.target.value = '';
        }}
      />

      <AssignJobModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        jobData={currentJob}
        onAssigned={handleJobAssigned}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

export default JobDetails;