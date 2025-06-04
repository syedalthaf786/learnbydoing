import React, { useState, useEffect } from "react";
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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
const API_URL = "http://localhost:5000/api/projects";
const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    category: "",
    estimatedMonths: "",
    technologies: "",
    roles: [],
    image: "",
    githubUrl: "",
    demoUrl: "",
    completed: false,
  });

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];
  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "DevOps",
    "AI/ML",
    "Other",
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleOpen = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        difficulty: "",
        category: "",
        estimatedMonths: "",
        technologies: "",
        roles: [{ title: "", skills: [], responsibilities: [] }], // Corrected 'roles'
        image: "",
        githubUrl: "",
        demoUrl: "",
        completed: false,
      });
      
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProject(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleRoleChange = (index, field, value) => {
    const updatedRoles = [...formData.roles];
    updatedRoles[index] = { ...updatedRoles[index], [field]: value };
    setFormData((prev) => ({ ...prev, roles: updatedRoles }));
  };

  const addRole = () => {
    setFormData((prev) => ({
      ...prev,
      roles: [...prev.roles, { title: "", skills: [], responsibilities: [] }],
    }));
  };

  const removeRole = (index) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await axios.put(`${API_URL}/${editingProject._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      handleClose();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${API_URL}/${projectId}`);
        setProjects(projects.filter((project) => project._id !== projectId));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Project Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Project
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Est. Months</TableCell>
              <TableCell>Technologies</TableCell>
              <TableCell>roles</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>GitHub</TableCell>
              <TableCell>Demo</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.difficulty}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.estimatedMonths}</TableCell>
                <TableCell>{project.technologies}</TableCell>
                <TableCell>
                  {project.roles.map((role, i) => (
                    <div key={i}>
                      <Typography variant="body2">{role.title}</Typography>
                      <Typography variant="caption">
                        Skills: {role.skills.join(", ")}
                      </Typography>
                      <Typography variant="caption">
                        Responsibilities: {role.responsibilities.join(", ")}
                      </Typography>
                    </div>
                  ))}
                </TableCell>

                <TableCell>
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ width: 50, height: 50, borderRadius: 5 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Demo
                    </a>
                  )}
                </TableCell>
                <TableCell>{project.completed ? "✅" : "❌"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(project)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Form for Adding/Editing Projects */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProject ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              name="title"
              label="Project Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="difficulty"
              label="Difficulty Level"
              select
              value={formData.difficulty}
              onChange={handleInputChange}
              required
            >
              {difficultyLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="category"
              label="Category"
              select
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="estimatedMonths"
              label="Estimated Months"
              type="number"
              value={formData.estimatedMonths}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="technologies"
              label="Technologies (comma-separated)"
              value={formData.technologies}
              onChange={handleInputChange}
              required
            />
             {formData.roles.map((role, index) => (
            <div key={index}>
              <TextField
                fullWidth
                margin="dense"
                label="Role Title"
                value={role.title}
                onChange={(e) => handleRoleChange(index, "title", e.target.value)}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Skills (comma-separated)"
                value={role.skills.join(",")}
                onChange={(e) => handleRoleChange(index, "skills", e.target.value.split(","))}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Responsibilities (comma-separated)"
                value={role.responsibilities.join(",")}
                onChange={(e) => handleRoleChange(index, "responsibilities", e.target.value.split(","))}
              />
              <Button onClick={() => removeRole(index)} color="secondary">
                Remove Role
              </Button>
            </div>
          ))}
          <Button onClick={addRole} color="primary">
            Add Role
          </Button>
            <TextField fullWidth margin="dense" name="image" label="Image URL" value={formData.image} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" name="githubUrl" label="GitHub URL" value={formData.githubUrl} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" name="demoUrl" label="Demo URL" value={formData.demoUrl} onChange={handleInputChange} />
            <FormControlLabel control={<Checkbox checked={formData.completed} onChange={(e) => setFormData((prev) => ({ ...prev, completed: e.target.checked }))} />} label="Completed" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">{editingProject ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProjectManagement;
