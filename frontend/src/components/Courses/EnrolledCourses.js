import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  LinearProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Fetch progressing courses from local storage
      const storedCourses = JSON.parse(localStorage.getItem('progressingCourses')) || [];
      setEnrolledCourses(storedCourses);
    } catch (err) {
      console.error('Error loading enrolled courses:', err);
      setError('Failed to load enrolled courses.');
    }
  }, []);

  const handleContinueCourse = (course) => {
    if (!course || !course._id) {
      setError('Invalid course data. Please check the course details.');
      return;
    }
    navigate(`/courses/${course._id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Enrolled Courses
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {enrolledCourses.length > 0 ? (
        <Grid container spacing={3}>
          {enrolledCourses.map((course, index) => (
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
                <CardMedia
                  component="img"
                  height="200"
                  image={course.image || 'https://via.placeholder.com/400x200'}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {course.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {course.description || 'No description available.'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Progress: {course.progress || 0}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress || 0}
                    sx={{ mt: 1 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleContinueCourse(course)}
                  >
                    Continue Course
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            You have not enrolled in any courses yet. Browse available courses to get started!
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

export default EnrolledCourses;