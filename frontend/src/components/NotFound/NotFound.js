import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 600,
            width: '100%',
          }}
        >
          <SentimentDissatisfied sx={{ fontSize: 64, mb: 2, color: 'text.secondary' }} />
          <Typography variant="h2" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" gutterBottom>
            Page Not Found
          </Typography>
          <Typography color="text.secondary" paragraph>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default NotFound;