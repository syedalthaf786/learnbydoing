import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import ProjectRoles from "./ProjectRoles";

const API_URL = process.env.REACT_APP_API_URL || "https://learnbydoing-1.onrender.com/api/projects";

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [assessmentPassed, setAssessmentPassed] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/${projectId}`);
        setProject(response.data);

        // Fetch the user's assigned role (Assuming it's stored in localStorage)
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
          setUserRole(JSON.parse(storedRole));
        }

        // Check if assessment was passed
        const completedProjects = JSON.parse(localStorage.getItem("completedProjects")) || [];
        const passed = completedProjects.some((p) => p.id === projectId);
        setAssessmentPassed(passed);
      } catch (err) {
        setError("Project not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const handleOpenWorkspace = () => {
    if (!assessmentPassed) {
      alert("You need to complete the assessment before opening the workspace.");
      return;
    }
    navigate(`/workspace/${projectId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={project.image || "/assets/default-project.jpg"}
              alt={project.title || "Project Image"}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {project.title || "Untitled Project"}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {project.description || "No description available."}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Technologies:
                </Typography>
                {project.technologies?.length ? (
                  project.technologies.map((tech) => (
                    <Chip key={tech} label={tech} variant="outlined" size="small" sx={{ mr: 1, mb: 1 }} />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No technologies listed.
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Category:
                </Typography>
                <Chip label={project.category || "Uncategorized"} color="primary" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Status:
                </Typography>
                <Chip label={project.completed ? "Completed" : "In Progress"} color={project.completed ? "success" : "warning"} />
              </Box>

              {userRole && (
                <Button variant="contained" color="primary" onClick={handleOpenWorkspace} sx={{ mt: 2 }}>
                  Open Workspace
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <ProjectRoles roles={project.role || []} projectId={project._id} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProjectDetail;
