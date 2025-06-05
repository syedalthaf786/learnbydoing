import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import {
  Timer,
  People,
  CheckCircle,
  School,
  Assignment,
  PlayCircleFilled
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Loading/Loading';

const fetchCourseDetail = async (courseId) => {
  const API_URL = process.env.REACT_APP_API_URL || 'https://learnbydoing-1.onrender.com/api';
  const response = await fetch(`${API_URL}/courses/${courseId}/detail`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch course details');
  }
  return await response.json();
};

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const data = await fetchCourseDetail(courseId);
        setCourse(data);
      } catch (err) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  if (loading) {
    return <Loading message="Loading course details..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={course.image}
              alt={course.title}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {course.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  icon={<Timer />} 
                  label={course.duration} 
                  variant="outlined"
                />
                <Chip 
                  label={course.level} 
                  variant="outlined"
                />
                <Chip 
                  icon={<People />} 
                  label={`${course.students} students`} 
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating 
                  value={course.rating} 
                  precision={0.1} 
                  readOnly 
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({course.rating})
                </Typography>
              </Box>

              <Typography variant="body1" paragraph>
                {course.description}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                What you'll learn
              </Typography>
              <Grid container spacing={2}>
                {course.objectives.map((objective, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <CheckCircle color="primary" />
                      <Typography>{objective}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Course Content
              </Typography>
              <List>
                {course.curriculum.map((section, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <School />
                      </ListItemIcon>
                      <ListItemText 
                        primary={section.title}
                        secondary={`${section.lessons.length} lessons`}
                      />
                    </ListItem>
                    <List component="div" disablePadding>
                      {section.lessons.map((lesson, lessonIndex) => (
                        <ListItem 
                          key={lessonIndex}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon>
                            <Assignment />
                          </ListItemIcon>
                          <ListItemText primary={lesson} />
                        </ListItem>
                      ))}
                    </List>
                    {index < course.curriculum.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<PlayCircleFilled />}
                onClick={() => {
                  if (user) {
                    navigate(`/courses/${courseId}/learn`);
                  } else {
                    navigate('/login', { 
                      state: { from: `/courses/${courseId}` }
                    });
                  }
                }}
                sx={{ mb: 2 }}
              >
                {user ? 'Start Learning' : 'Login to Start'}
              </Button>

              <Typography variant="body2" color="text.secondary" paragraph>
                This course includes:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Full access to course content" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Access on mobile and desktop" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Certificate of completion" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CourseDetail;