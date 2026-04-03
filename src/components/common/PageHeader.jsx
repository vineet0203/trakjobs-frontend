// components/common/PageHeader.jsx
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import {
  Box,
  Typography,
  Breadcrumbs,
  Paper
} from '@mui/material';

const PageHeader = ({
  breadcrumb = [],
  title,
  subtitle,
  actions
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mb: 3,
        backgroundColor: 'transparent',
      }}
    >
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <Breadcrumbs
          separator=">"
          sx={{
            mb: 1,
            '& .MuiBreadcrumbs-separator': {
              mx: 0.75,
              color: '#9ca3af',
              fontSize: 14,
              fontWeight: 500,
            },
          }}
        >
          {breadcrumb.map((item, index) =>
            item.path ? (
              <Link
                key={index}
                component={RouterLink}
                to={item.path}
                underline="none"
                sx={{
                  fontSize: 14,
                  color: '#6b7280',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'grey.800'
                  }
                }}
              >
                {item.label}
              </Link>
            ) : item.onClick ? (
              <Typography
                key={index}
                fontSize={14}
                color="#6b7280"
                fontWeight={400}
                sx={{ cursor: 'pointer' }}
                onClick={item.onClick}
              >
                {item.label}
              </Typography>
            ) : (
              <Typography
                key={index}
                fontSize={14}
                color={item.current ? '#111827' : '#6b7280'}
                fontWeight={item.current ? 600 : 400}
              >
                {item.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      {/* Title + Actions - Always in same row */}
      {(title || actions) && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          sx={{ mb: subtitle ? 0.5 : 0 }}
        >
          {title ? <Typography variant="h5" fontWeight={600}>{title}</Typography> : <Box />}

          {actions && (
            <Box display="flex" alignItems="center" gap={1.5}>
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* Subtitle - Always below title */}
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default PageHeader;