// features/clients/components/ClientTable/ClientCategoryChip.jsx
import React from 'react';
import { Chip } from '@mui/material';
import { SERVICE_CATEGORIES } from '../../constants/clientConstants';

// Color mapping for different category types
const getCategoryColor = (category) => {
  // Give each main category a specific color
  const colors = {
    home_repair: { bgcolor: '#4caf50', color: '#ffffff' }, // Green
    electrical: { bgcolor: '#ff9800', color: '#ffffff' }, // Orange
    plumbing: { bgcolor: '#2196f3', color: '#ffffff' }, // Blue
    painting_wall: { bgcolor: '#9e9e9e', color: '#ffffff' }, // Grey
    carpentry: { bgcolor: '#795548', color: '#ffffff' }, // Brown
    cleaning: { bgcolor: '#00bcd4', color: '#ffffff' }, // Cyan
    appliance: { bgcolor: '#e91e63', color: '#ffffff' }, // Pink
    outdoor: { bgcolor: '#8bc34a', color: '#ffffff' }, // Light Green
    smart_home: { bgcolor: '#3f51b5', color: '#ffffff' }, // Indigo
    moving_support: { bgcolor: '#ff5722', color: '#ffffff' }, // Deep Orange
  };
  
  if (category && colors[category]) {
    return colors[category];
  }
  
  return { bgcolor: '#e3f2fd', color: '#1976d2' };
};

// Helper function to get display label for category
const getCategoryLabel = (category) => {
  if (!category) return 'Regular';
  
  if (SERVICE_CATEGORIES[category]) {
    return SERVICE_CATEGORIES[category].label;
  }
  
  // Fallback: Format the category value nicely
  return category
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ClientCategoryChip = ({ category, clientType, size = 'small' }) => {
  const displayLabel = getCategoryLabel(category, clientType);
  const colors = getCategoryColor(category, clientType);
  
  return (
    <Chip
      label={displayLabel}
      size={size}
      sx={{
        backgroundColor: colors.bgcolor,
        color: colors.color,
        height: size === 'small' ? 24 : 28,
        '& .MuiChip-label': {
          fontSize: size === 'small' ? '0.75rem' : '0.875rem',
          fontWeight: 500,
          px: 1.5,
          lineHeight: 1,
        }
      }}
    />
  );
};

export default ClientCategoryChip;