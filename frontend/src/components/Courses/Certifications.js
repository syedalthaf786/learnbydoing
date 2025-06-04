import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Fetch certifications from local storage
      const storedCertifications = JSON.parse(localStorage.getItem('certifications')) || [];
      setCertifications(storedCertifications);
    } catch (err) {
      console.error('Error loading certifications:', err);
      setError('Failed to load certifications.');
    }
  }, []);

  const handleDownloadCertificate = (certification) => {
    // Simulate certificate download
    alert(`Downloading certificate for ${certification.courseName}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Certifications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {certifications.length > 0 ? (
        <Grid container spacing={3}>
          {certifications.map((certification, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {certification.courseName}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    Issued on: {new Date(certification.issueDate).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownloadCertificate(certification)}
                  >
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            You have not earned any certifications yet. Complete courses to earn certifications!
          </Alert>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/courses')}
          >
            Browse Courses
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default Certifications;