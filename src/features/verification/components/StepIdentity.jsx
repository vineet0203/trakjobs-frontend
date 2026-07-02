import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardActionArea, LinearProgress } from '@mui/material';
import { UploadCloud, CheckCircle, FileText } from 'lucide-react';
import { verificationApi } from '../api/verificationApi';

export default function StepIdentity({ data, onChange, onNext, onBack }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleIdTypeSelect = (type) => {
    onChange('idType', type);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!data.idType) {
      alert('Please select a document type first.');
      return;
    }

    onChange('fileName', file.name);
    setUploading(true);
    setProgress(30);

    try {
      const res = await verificationApi.uploadDocument(file, data.idType);
      if (res.success) {
        setProgress(100);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload document.');
      onChange('fileName', '');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.idType) {
      alert('Please select an ID type.');
      return;
    }
    if (!data.fileName || uploading) {
      alert('Please upload a valid ID document.');
      return;
    }
    onNext();
  };

  const docTypes = [
    { key: 'passport', label: 'Passport' },
    { key: 'driver_license', label: "Driver's License" },
    { key: 'national_id', label: 'National ID Card' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F2744', mb: 2 }}>
        Select Document Type
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {docTypes.map((doc) => (
          <Card
            key={doc.key}
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: 2,
              borderColor: data.idType === doc.key ? '#0F2744' : '#E2E8F0',
              borderWidth: data.idType === doc.key ? 2 : 1,
            }}
          >
            <CardActionArea onClick={() => handleIdTypeSelect(doc.key)} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F2744' }}>
                {doc.label}
              </Typography>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F2744', mb: 2 }}>
        Upload Document (Front Side)
      </Typography>

      <Box
        sx={{
          border: '2px dashed #E2E8F0',
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          bgcolor: '#F8FAFC',
          cursor: 'pointer',
          position: 'relative',
          '&:hover': { bgcolor: '#F1F5F9', borderColor: '#CBD5E1' },
        }}
        component="label"
      >
        <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
        {!data.fileName && !uploading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <UploadCloud size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F2744', mb: 0.5 }}>
              Drag & drop your ID file here or click to upload
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Supports PDF, PNG, JPG (Max 5MB)
            </Typography>
          </Box>
        )}

        {uploading && (
          <Box sx={{ width: '100%', py: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F2744', mb: 1 }}>
              Uploading document... {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
          </Box>
        )}

        {data.fileName && !uploading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CheckCircle size={48} color="#22C55E" style={{ marginBottom: 16 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FileText size={18} color="#64748B" />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F2744' }}>
                {data.fileName}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#22C55E', fontWeight: 500 }}>
              Upload completed successfully! Click to replace.
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            textTransform: 'none',
            color: '#64748B',
            borderColor: '#CBD5E1',
            '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' },
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            textTransform: 'none',
            bgcolor: '#0F2744',
            '&:hover': { bgcolor: '#0A1B30' },
          }}
        >
          Next
        </Button>
      </Box>
    </form>
  );
}
