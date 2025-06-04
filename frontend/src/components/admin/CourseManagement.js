import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    image: '',
    duration: '',
    level: 'beginner',
    instructor: '',
    objectives: '',
    curriculumTitle: '',
    curriculumLessons: '',
    content: '', // JSON string for modules (content)
  });

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const resetForm = () => {
    setCourseForm({
      title: '',
      description: '',
      image: '',
      duration: '',
      level: 'beginner',
      instructor: '',
      objectives: '',
      curriculumTitle: '',
      curriculumLessons: '',
      content: '',
    });
  };

  const handleAddNew = () => {
    setSelectedCourse(null);
    resetForm();
    setOpenDialog(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    const objectivesStr = course.objectives ? course.objectives.join(', ') : '';
    let curriculumTitle = '';
    let curriculumLessons = '';
    if (course.curriculum && course.curriculum.length > 0) {
      curriculumTitle = course.curriculum[0].title;
      curriculumLessons = course.curriculum[0].lessons.join(', ');
    }
    // For content modules, we show a JSON string of the array
    const contentStr = course.content ? JSON.stringify(course.content, null, 2) : '';
    setCourseForm({
      title: course.title,
      description: course.description,
      image: course.image,
      duration: course.duration,
      level: course.level,
      instructor: course.instructor || '',
      objectives: objectivesStr,
      curriculumTitle,
      curriculumLessons,
      content: contentStr,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete course');
        }
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert objectives string to an array.
    const objectivesArray = courseForm.objectives
      .split(',')
      .map(obj => obj.trim())
      .filter(obj => obj);

    // Create a curriculum array from the section title and lessons.
    const curriculumArray = [];
    if (courseForm.curriculumTitle.trim() !== '') {
      const lessonsArray = courseForm.curriculumLessons
        .split(',')
        .map(lesson => lesson.trim())
        .filter(lesson => lesson);
      curriculumArray.push({
        title: courseForm.curriculumTitle.trim(),
        lessons: lessonsArray,
      });
    }

    // Parse the content modules JSON if provided.
    let contentArray = [];
    if (courseForm.content.trim() !== '') {
      try {
        contentArray = JSON.parse(courseForm.content);
      } catch (error) {
        setError('Invalid JSON for content modules.');
        return;
      }
    }

    const payload = {
      title: courseForm.title,
      description: courseForm.description,
      image: courseForm.image,
      duration: courseForm.duration,
      level: courseForm.level,
      instructor: courseForm.instructor,
      objectives: objectivesArray,
      curriculum: curriculumArray,
      content: contentArray, // content modules based on the model
    };

    try {
      const url = selectedCourse
        ? `/api/courses/${selectedCourse._id}`
        : '/api/courses';
      const method = selectedCourse ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${selectedCourse ? 'update' : 'create'} course`);
      }
      const data = await response.json();
      if (selectedCourse) {
        setCourses(courses.map(course => course._id === selectedCourse._id ? data.course : course));
      } else {
        setCourses([...courses, data.course]);
      }
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading courses...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Course Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
          Add New Course
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={course.image || 'https://via.placeholder.com/300x140'}
                alt={course.title}
              />
              <CardContent>
                <Typography variant="h6" noWrap>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {course.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Chip label={course.level} size="small" color="primary" />
                  {course.instructor && (
                    <Chip label={`Instructor: ${course.instructor}`} size="small" color="info" />
                  )}
                </Box>
                <Typography variant="body2">
                  Duration: {course.duration}
                </Typography>
                {course.students !== undefined && (
                  <Typography variant="body2">
                    {course.students} students enrolled
                  </Typography>
                )}
                {course.rating !== undefined && (
                  <Typography variant="body2">
                    Rating: {course.rating}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Tooltip title="Edit Course">
                  <IconButton onClick={() => handleEdit(course)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Course">
                  <IconButton onClick={() => handleDelete(course._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Course">
                  <IconButton href={`/courses/${course._id}`} target="_blank">
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={courseForm.image}
                  onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  placeholder="e.g., 2 hours"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    label="Level"
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructor"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Objectives (comma separated)"
                  value={courseForm.objectives}
                  onChange={(e) => setCourseForm({ ...courseForm, objectives: e.target.value })}
                  helperText="Enter objectives separated by commas"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Curriculum Section Title"
                  value={courseForm.curriculumTitle}
                  onChange={(e) => setCourseForm({ ...courseForm, curriculumTitle: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Curriculum Lessons (comma separated)"
                  value={courseForm.curriculumLessons}
                  onChange={(e) => setCourseForm({ ...courseForm, curriculumLessons: e.target.value })}
                  helperText="Enter lessons separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content Modules (JSON format)"
                  value={courseForm.content}
                  onChange={(e) => setCourseForm({ ...courseForm, content: e.target.value })}
                  multiline
                  rows={4}
                  helperText="Enter a valid JSON array for modules"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCourse ? 'Update Course' : 'Create Course'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CourseManagement;