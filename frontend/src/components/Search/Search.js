import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert
} from '@mui/material';
import { Search as SearchIcon, Timer, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';

const mockCourses = [
  {
    id: 1,
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
    image: '/images/web-dev.jpg',
    duration: '8 weeks',
    level: 'Beginner',
    students: 1234,
    category: 'Web Development'
  },
  {
    id: 2,
    title: 'React.js Advanced Concepts',
    description: 'Master advanced React patterns and best practices.',
    image: '/images/react.jpg',
    duration: '6 weeks',
    level: 'Advanced',
    students: 856,
    category: 'JavaScript'
  },
  // Add more mock courses as needed
];

const categories = [
  'All',
  'Web Development',
  'JavaScript',
  'Python',
  'Data Science',
  'Mobile Development',
  'Machine Learning'
];

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourses(mockCourses);
      } catch (err) {
        setError(err.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || course.category === category;
    const matchesLevel = level === 'All' || course.level === level;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loading message="Searching courses..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Level</InputLabel>
              <Select
                value={level}
                label="Level"
                onChange={(e) => setLevel(e.target.value)}
              >
                {levels.map((lvl) => (
                  <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {paginatedCourses.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No courses found matching your criteria
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {course.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<Timer />} 
                        label={course.duration} 
                        size="small"
                      />
                      <Chip 
                        label={course.level}
                        size="small"
                        color="primary"
                      />
                      <Chip 
                        icon={<People />}
                        label={`${course.students} students`}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredCourses.length > coursesPerPage && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(filteredCourses.length / coursesPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default Search;