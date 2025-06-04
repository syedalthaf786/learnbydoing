import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const MentorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    skills: '',
    availability: '',
    hourlyRate: '',
  });

  const specializationOptions = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'DevOps',
    'UI/UX Design',
    'Machine Learning',
    'Cloud Computing',
  ];

  const availabilityOptions = [
    'Full-time',
    'Part-time',
    'Weekends',
    'Evenings',
    'Flexible',
  ];

  useEffect(() => {
    // TODO: Fetch mentors from API
    // fetchMentors();
  }, []);

  const handleOpen = (mentor = null) => {
    if (mentor) {
      setEditingMentor(mentor);
      setFormData(mentor);
    } else {
      setEditingMentor(null);
      setFormData({
        name: '',
        email: '',
        specialization: '',
        experience: '',
        skills: '',
        availability: '',
        hourlyRate: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMentor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMentor) {
        // TODO: Update mentor API call
        // await updateMentor(editingMentor.id, formData);
      } else {
        // TODO: Create mentor API call
        // await createMentor(formData);
      }
      handleClose();
      // TODO: Refresh mentors
      // fetchMentors();
    } catch (error) {
      console.error('Error saving mentor:', error);
    }
  };

  const handleDelete = async (mentorId) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      try {
        // TODO: Delete mentor API call
        // await deleteMentor(mentorId);
        // TODO: Refresh mentors
        // fetchMentors();
      } catch (error) {
        console.error('Error deleting mentor:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Mentor Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Mentor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Experience (Years)</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Hourly Rate ($)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mentors.map((mentor) => (
              <TableRow key={mentor.id}>
                <TableCell>{mentor.name}</TableCell>
                <TableCell>{mentor.email}</TableCell>
                <TableCell>{mentor.specialization}</TableCell>
                <TableCell>{mentor.experience}</TableCell>
                <TableCell>
                  {mentor.skills.split(',').map((skill) => (
                    <Chip
                      key={skill}
                      label={skill.trim()}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>{mentor.availability}</TableCell>
                <TableCell>${mentor.hourlyRate}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(mentor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(mentor.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMentor ? 'Edit Mentor' : 'Add New Mentor'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="specialization"
              label="Specialization"
              select
              value={formData.specialization}
              onChange={handleInputChange}
              required
            >
              {specializationOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="experience"
              label="Experience (Years)"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="skills"
              label="Skills (comma-separated)"
              value={formData.skills}
              onChange={handleInputChange}
              required
              helperText="Enter skills separated by commas (e.g., React, Node.js, Python)"
            />
            <TextField
              fullWidth
              margin="dense"
              name="availability"
              label="Availability"
              select
              value={formData.availability}
              onChange={handleInputChange}
              required
            >
              {availabilityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="hourlyRate"
              label="Hourly Rate ($)"
              type="number"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingMentor ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default MentorManagement; 