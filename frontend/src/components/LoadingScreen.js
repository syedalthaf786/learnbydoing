import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        background: 'linear-gradient(135deg, #10B981 0%, #2563EB 100%)',
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          color: 'white',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 500,
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
}

export default LoadingScreen; 