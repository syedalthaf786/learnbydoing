import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Alert,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Rating,
} from '@mui/material';
import { Search, Timer, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import Loading from '../Loading/Loading';

// Updated API function that calls the backend endpoint
const fetchCourses = async () => {
  const API_URL = process.env.REACT_APP_API_URL || 'https://learnbydoing-1.onrender.com/api';
  const response = await fetch(`${API_URL}/courses`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch courses from server');
  }
  return await response.json();
};

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleEnrollCourse = (e) => {
    e.stopPropagation(); // Prevent triggering the card's onClick event

    // Fetch existing progressing courses from local storage
    const progressingCourses = JSON.parse(localStorage.getItem('progressingCourses')) || [];

    // Check if the course is already enrolled
    const isAlreadyEnrolled = progressingCourses.some((c) => c._id === course._id);
    if (isAlreadyEnrolled) {
      alert('You are already enrolled in this course.');
      return;
    }

    // Add the new course to progressing courses
    const updatedCourses = [...progressingCourses, { ...course, progress: 0 }];
    localStorage.setItem('progressingCourses', JSON.stringify(updatedCourses));

    alert('Course enrolled successfully!');
    navigate('/dashboard'); // Redirect to the dashboard
  };

  return (
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
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/courses/${course._id || course.id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={course.image}
        alt={course.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {course.title}
        </Typography>
        <Typography color="text.secondary" paragraph>
          {course.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Instructor: {course.instructor}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            icon={<Timer />}
            label={course.duration}
            variant="outlined"
            size="small"
          />
          <Chip
            label={course.level}
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<People />}
            label={`${course.students} students`}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={course.rating}
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({course.rating})
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleEnrollCourse}
        >
          Enroll for this Course
        </Button>
      </CardContent>
    </Card>
  );
}

function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    loading,
    error,
    data: courses,
    execute: loadCourses,
  } = useApi(fetchCourses);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filteredCourses = courses?.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading message="Loading courses..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredCourses?.map((course) => (
          <Grid item xs={12} md={4} key={course._id || course.id}>
            <CourseCard course={course} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Courses;