import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Notifications,
  Language,
  Brightness4,
  VolumeUp,
  Speed,
  Email
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

function Settings() {
  const { toggleTheme, isDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    language: 'en',
    autoplay: true,
    playbackSpeed: '1.0',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Settings saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save settings. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <List>
          {/* Theme Setting */}
          <ListItem>
            <ListItemIcon>
              <Brightness4 />
            </ListItemIcon>
            <ListItemText 
              primary="Dark Mode" 
              secondary="Toggle between light and dark theme"
            />
            <Switch
              edge="end"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
          </ListItem>
          <Divider />

          {/* Email Notifications */}
          <ListItem>
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText 
              primary="Email Notifications" 
              secondary="Receive course updates and announcements"
            />
            <Switch
              edge="end"
              checked={settings.emailNotifications}
              onChange={handleChange('emailNotifications')}
            />
          </ListItem>
          <Divider />

          {/* Push Notifications */}
          <ListItem>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText 
              primary="Push Notifications" 
              secondary="Get instant notifications in your browser"
            />
            <Switch
              edge="end"
              checked={settings.pushNotifications}
              onChange={handleChange('pushNotifications')}
            />
          </ListItem>
          <Divider />

          {/* Language Settings */}
          <ListItem>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            <ListItemText 
              primary="Language" 
              secondary="Choose your preferred language"
            />
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={settings.language}
                onChange={handleChange('language')}
                size="small"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <Divider />

          {/* Autoplay Settings */}
          <ListItem>
            <ListItemIcon>
              <VolumeUp />
            </ListItemIcon>
            <ListItemText 
              primary="Autoplay Videos" 
              secondary="Automatically play next video"
            />
            <Switch
              edge="end"
              checked={settings.autoplay}
              onChange={handleChange('autoplay')}
            />
          </ListItem>
          <Divider />

          {/* Playback Speed */}
          <ListItem>
            <ListItemIcon>
              <Speed />
            </ListItemIcon>
            <ListItemText 
              primary="Default Playback Speed" 
              secondary="Set your preferred video playback speed"
            />
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={settings.playbackSpeed}
                onChange={handleChange('playbackSpeed')}
                size="small"
              >
                <MenuItem value="0.5">0.5x</MenuItem>
                <MenuItem value="0.75">0.75x</MenuItem>
                <MenuItem value="1.0">1.0x</MenuItem>
                <MenuItem value="1.25">1.25x</MenuItem>
                <MenuItem value="1.5">1.5x</MenuItem>
                <MenuItem value="2.0">2.0x</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          size="large"
        >
          Save Changes
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Settings;