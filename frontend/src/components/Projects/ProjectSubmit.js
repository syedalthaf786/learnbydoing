import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box
} from '@mui/material';

function ProjectSubmit({ open, handleClose, onSubmit }) {
  const [project, setProject] = useState({
    title: '',
    description: '',
    category: '',
    technologies: [],
    githubUrl: '',
    demoUrl: '',
    image: ''
  });

  const [newTech, setNewTech] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(project);
    setProject({
      title: '',
      description: '',
      category: '',
      technologies: [],
      githubUrl: '',
      demoUrl: '',
      image: ''
    });
  };

  const handleTechAdd = (tech) => {
    if (tech && !project.technologies.includes(tech)) {
      setProject({
        ...project,
        technologies: [...project.technologies, tech]
      });
      setNewTech('');
    }
  };

  const handleTechDelete = (techToDelete) => {
    setProject({
      ...project,
      technologies: project.technologies.filter(tech => tech !== techToDelete)
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Submit New Project</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Project Title"
            fullWidth
            required
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
          />
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={project.category}
              label="Category"
              onChange={(e) => setProject({ ...project, category: e.target.value })}
            >
              <MenuItem value="Web Development">Web Development</MenuItem>
              <MenuItem value="Mobile Development">Mobile Development</MenuItem>
              <MenuItem value="AI/ML">AI/ML</MenuItem>
              <MenuItem value="Data Science">Data Science</MenuItem>
              <MenuItem value="Blockchain">Blockchain</MenuItem>
              <MenuItem value="IoT">IoT</MenuItem>
            </Select>
          </FormControl>
          <Box>
            <TextField
              label="Add Technology"
              size="small"
              fullWidth
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTechAdd(newTech);
                }
              }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {project.technologies.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  onDelete={() => handleTechDelete(tech)}
                />
              ))}
            </Box>
          </Box>
          <TextField
            label="GitHub URL"
            fullWidth
            value={project.githubUrl}
            onChange={(e) => setProject({ ...project, githubUrl: e.target.value })}
          />
          <TextField
            label="Demo URL"
            fullWidth
            value={project.demoUrl}
            onChange={(e) => setProject({ ...project, demoUrl: e.target.value })}
          />
          <TextField
            label="Image URL"
            fullWidth
            required
            value={project.image}
            onChange={(e) => setProject({ ...project, image: e.target.value })}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!project.title || !project.description || !project.category || !project.image}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectSubmit;