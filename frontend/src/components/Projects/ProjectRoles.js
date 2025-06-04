import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { Assignment, Check, School } from '@mui/icons-material';
import { applyForRole, fetchProjects } from '../../services/projectService';
import Assessment from './Assessment';
// import { useNavigate } from 'react-router-dom';

function ProjectRoles({ projectId }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [application, setApplication] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);
  // const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const projects = await fetchProjects();
        const project = projects.find(proj => proj._id === projectId);
        if (project) {
          setRoles(project.roles);
          setProject(project);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [projectId]);

  const handleApply = (role) => {
    setSelectedRole(role);
    setShowAssessment(true);
  };

  const handleCloseAssessment = () => {
    setShowAssessment(false);
    setSelectedRole(null);
  };

  const handleAssessmentComplete = async (result) => {
    if (result.passed) {
      setShowAssessment(false);
      setOpen(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Please try the assessment again after reviewing the requirements.',
        severity: 'error'
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await applyForRole(projectId, selectedRole.title, application);
      setSnackbar({
        open: true,
        message: `Successfully applied for ${selectedRole.title} role!`,
        severity: 'success'
      });
      setOpen(false);
      setApplication('');
      setSelectedRole(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit application',
        severity: 'error'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setApplication('');
  };

  if (loading) {
    return <Typography>Loading roles...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Available Roles
      </Typography>
      {roles.length === 0 ? (
        <Typography>No roles available for this project.</Typography>
      ) : (
        roles.map((role, index) => (
          <Card key={index} sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                {role.title}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Required Skills:
                </Typography>
                {role.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Responsibilities:
              </Typography>
              <List dense>
                {role.responsibilities.map((resp, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <Check color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={resp}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                startIcon={<School />}
                onClick={() => handleApply(role)}
                sx={{ mt: 2 }}
                fullWidth
              >
                Take Assessment & Apply
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      <Assessment
        open={showAssessment}
        onClose={handleCloseAssessment}
        role={selectedRole}
        onComplete={handleAssessmentComplete}
        projectId={projectId}
        projectTitle={project?.title}
      />

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Apply for {selectedRole?.title}
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Congratulations! You passed the assessment. Please complete your application below.
          </Alert>
          <TextField
            autoFocus
            margin="dense"
            label="Why are you interested in this role?"
            fullWidth
            multiline
            rows={4}
            value={application}
            onChange={(e) => setApplication(e.target.value)}
            placeholder="Tell us about your relevant experience and why you'd be a good fit for this role..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!application.trim()}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProjectRoles;
