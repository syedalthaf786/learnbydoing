import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

function AssignmentManagement() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    points: '',
    type: 'quiz',
    difficulty: 'medium',
  });

  const fetchData = async () => {
    try {
      const [assignmentsRes, coursesRes] = await Promise.all([
        fetch('/api/admin/assignments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/admin/courses', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (!assignmentsRes.ok || !coursesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [assignmentsData, coursesData] = await Promise.all([
        assignmentsRes.json(),
        coursesRes.json()
      ]);

      setAssignments(assignmentsData.assignments);
      setCourses(coursesData.courses);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNew = () => {
    setSelectedAssignment(null);
    setAssignmentForm({
      title: '',
      description: '',
      courseId: '',
      dueDate: '',
      points: '',
      type: 'quiz',
      difficulty: 'medium',
    });
    setOpenDialog(true);
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      courseId: assignment.courseId,
      dueDate: assignment.dueDate?.split('T')[0] || '',
      points: assignment.points,
      type: assignment.type,
      difficulty: assignment.difficulty,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const response = await fetch(`/api/admin/assignments/${assignmentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete assignment');
        }

        setAssignments(assignments.filter(a => a._id !== assignmentId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedAssignment
        ? `/api/admin/assignments/${selectedAssignment._id}`
        : '/api/admin/assignments';
      
      const method = selectedAssignment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(assignmentForm)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${selectedAssignment ? 'update' : 'create'} assignment`);
      }

      const data = await response.json();
      
      if (selectedAssignment) {
        setAssignments(assignments.map(assignment => 
          assignment._id === selectedAssignment._id ? data.assignment : assignment
        ));
      } else {
        setAssignments([...assignments, data.assignment]);
      }
      
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading assignments...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Assignment Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New Assignment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {assignments.map((assignment) => (
          <Grid item xs={12} sm={6} md={4} key={assignment._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" noWrap>
                    {assignment.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {assignment.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={assignment.type}
                    size="small"
                    color="primary"
                  />
                  <Chip
                    label={assignment.difficulty}
                    size="small"
                    color={getDifficultyColor(assignment.difficulty)}
                  />
                  <Chip
                    label={`${assignment.points} points`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Course: {courses.find(c => c._id === assignment.courseId)?.title || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Edit Assignment">
                  <IconButton onClick={() => handleEdit(assignment)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Assignment">
                  <IconButton onClick={() => handleDelete(assignment._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedAssignment ? 'Edit Assignment' : 'Add New Assignment'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={assignmentForm.courseId}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, courseId: e.target.value })}
                    label="Course"
                  >
                    {courses.map((course) => (
                      <MenuItem key={course._id} value={course._id}>
                        {course.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={assignmentForm.dueDate}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Points"
                  type="number"
                  value={assignmentForm.points}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, points: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={assignmentForm.type}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, type: e.target.value })}
                    label="Type"
                  >
                    <MenuItem value="quiz">Quiz</MenuItem>
                    <MenuItem value="assignment">Assignment</MenuItem>
                    <MenuItem value="project">Project</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={assignmentForm.difficulty}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, difficulty: e.target.value })}
                    label="Difficulty"
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedAssignment ? 'Update Assignment' : 'Create Assignment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AssignmentManagement; 