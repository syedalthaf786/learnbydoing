import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Grid,
  TextField,
  Card,
  CardContent,
} from '@mui/material';

function Settings() {
  const [settings, setSettings] = useState({
    enableEmailNotifications: true,
    enableAutoEnrollment: false,
    maxCoursesPerUser: 5,
    maxAssignmentsPerCourse: 10,
    defaultCoursePrice: 49.99,
    siteName: 'Learning Platform',
    supportEmail: 'support@learningplatform.com',
    maintenanceMode: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setSuccess(true);
      setError(null);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Platform Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings updated successfully
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Support Email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  margin="normal"
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                System Controls
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    />
                  }
                  label="Maintenance Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableEmailNotifications}
                      onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAutoEnrollment}
                      onChange={(e) => handleChange('enableAutoEnrollment', e.target.checked)}
                    />
                  }
                  label="Auto Enrollment"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Settings
              </Typography>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Max Courses Per User"
                  type="number"
                  value={settings.maxCoursesPerUser}
                  onChange={(e) => handleChange('maxCoursesPerUser', parseInt(e.target.value))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Max Assignments Per Course"
                  type="number"
                  value={settings.maxAssignmentsPerCourse}
                  onChange={(e) => handleChange('maxAssignmentsPerCourse', parseInt(e.target.value))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Default Course Price"
                  type="number"
                  value={settings.defaultCoursePrice}
                  onChange={(e) => handleChange('defaultCoursePrice', parseFloat(e.target.value))}
                  margin="normal"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          size="large"
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
}

export default Settings; 