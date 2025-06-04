import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
} from '@mui/material';
import { MarkEmailRead as MarkEmailReadIcon } from '@mui/icons-material';
import api from '../../services/api';

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const verifyEmail = useCallback(async () => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(response.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed');
    }
  }, [token]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6">Verifying your email...</Typography>
          </>
        );

      case 'success':
        return (
          <>
            <MarkEmailReadIcon sx={{ fontSize: 60, color: 'success.main', mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Email Verified Successfully!
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Proceed to Login
            </Button>
          </>
        );

      case 'error':
        return (
          <>
            <Alert severity="error" sx={{ mb: 3 }}>
              {message}
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/register')}
            >
              Back to Registration
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
};

export default EmailVerification;