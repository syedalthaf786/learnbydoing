import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function UserDashboard() {
  const { user } = useAuth();
  const [completedProjects, setCompletedProjects] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [progressingCourses, setProgressingCourses] = useState([]); // New state for progressing courses
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Fetch completed projects from local storage (or API)
      const storedProjects = JSON.parse(localStorage.getItem('completedProjects')) || [];
      const updatedProjects = storedProjects.map((project) => ({
        ...project,
        title: project.title || 'Untitled Project',
        _id: project._id || project.id || 'unknown',
        role: project.role || 'Unknown Role',
      }));
      setCompletedProjects(updatedProjects);
      console.log('Completed Projects:', updatedProjects);

      // Fetch completed courses from local storage (or API)
      const storedCourses = JSON.parse(localStorage.getItem('completedCourses')) || [];
      const updatedCourses = storedCourses.map((course) => ({
        ...course,
        title: course.title || 'Untitled Course',
        _id: course._id || course.id || 'unknown',
        completedAt: course.completedAt || null,
      }));
      setCompletedCourses(updatedCourses);
      console.log('Completed Courses:', updatedCourses);

      // Fetch progressing courses from local storage (or API)
      const storedProgressingCourses = JSON.parse(localStorage.getItem('progressingCourses')) || [];
      const updatedProgressingCourses = storedProgressingCourses.map((course) => ({
        ...course,
        title: course.title || 'Untitled Course',
        _id: course._id || course.id || 'unknown',
        progress: course.progress || 0, // Add progress percentage
      }));
      setProgressingCourses(updatedProgressingCourses);
      console.log('Progressing Courses:', updatedProgressingCourses);
    } catch (err) {
      console.error('Error loading recent activities:', err);
      setError('Failed to load recent activities');
    }
  }, []);

  const handleOpenCourse = (course) => {
    if (!course || !course._id || course._id === 'unknown') {
      setError('Invalid course data. Please check the course details.');
      return;
    }

    navigate(`/courses/${course._id}`);
  };
  // const handleOpenProject = (project) => {
  //   if (!project || !project._id || project._id === 'unknown') {
  //     setError('Invalid project data. Please check the project details.');
  //     return;
  //   }
  
  //   // Navigate to the workspace with the project ID
  //   navigate(`/workspace/${project._id}`, {
  //     state: { 
  //       projectTitle: project.title,
  //       projectRole: project.role
  //     }
  //   });
  // };
  const handleOpenProject = (project) => {
    if (!project || !project._id || project._id === "unknown") {
      setError("Invalid project data. Please complete a project assessment first.");
      return;
    }
    
    // Validate required project fields
    const requiredFields = ['title', 'role', 'completedAt'];
    const missingFields = requiredFields.filter(field => !project[field]);
    
    if (missingFields.length > 0) {
      setError(`Project data is incomplete. Missing: ${missingFields.join(', ')}`);
      return;
    }

    navigate(`/workspace/${project._id}`, { 
      state: { project },
      replace: true
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.email?.replace('@gmail.com', '') || 'User'}!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Course Completion
              </Typography>
              <LinearProgress variant="determinate" value={60} sx={{ mt: 1 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Courses
            </Typography>
            <Typography variant="h4">{progressingCourses.length}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Projects
            </Typography>
            <Typography variant="h4">{completedProjects.length}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Grid container spacing={2}>
              {/* Projects Activity */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Project Activity
                </Typography>
                {completedProjects.length > 0 ? (
                  completedProjects.map((project, index) => (
                    <Card variant="outlined" key={index} sx={{ mb: 1 }}>
                      <CardContent>
                        <Typography variant="subtitle1">
                          {project.title} - {project.role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Assignment Completed on:{' '}
                          {project.completedAt ? new Date(project.completedAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1 }}
                          onClick={() => handleOpenProject(project)}
                        >
                          Open Project
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="info">
                      No completed projects yet. Browse available projects to get started!
                    </Alert>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => navigate('/projects')}
                    >
                      Browse Projects
                    </Button>
                  </Box>
                )}
              </Grid>

              {/* Progressing Courses Activity */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Progressing Courses
                </Typography>
                {progressingCourses.length > 0 ? (
                  progressingCourses.map((course, index) => (
                    <Card variant="outlined" key={index} sx={{ mb: 1 }}>
                      <CardContent>
                        <Typography variant="subtitle1">{course.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Progress: {course.progress}%
                        </Typography>
                        <LinearProgress variant="determinate" value={course.progress} sx={{ mt: 1 }} />
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1 }}
                          onClick={() => handleOpenCourse(course)}
                        >
                          Continue Course
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="info">
                      No progressing courses yet. Browse available courses to get started!
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
              </Grid>

              {/* Completed Courses Activity */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Completed Courses
                </Typography>
                {completedCourses.length > 0 ? (
                  completedCourses.map((course, index) => (
                    <Card variant="outlined" key={index} sx={{ mb: 1 }}>
                      <CardContent>
                        <Typography variant="subtitle1">{course.title}</Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1 }}
                          onClick={() => handleOpenCourse(course)}
                        >
                          Open Course
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="info">
                      No completed courses yet. Browse available courses to get started!
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
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserDashboard;
