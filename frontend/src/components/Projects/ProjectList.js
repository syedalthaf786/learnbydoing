import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import ProjectCard from './ProjectCard';
import Loading1 from 'components/Loading/Loading';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "https://learnbydoing-1.onrender.com/api/projects";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_URL);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        Our Projects
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Loading1 />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Grid item key={project._id} xs={12} sm={6} md={4}>
                <ProjectCard project={project} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center" sx={{ width: "100%", py: 4 }}>
              No projects found.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default ProjectList;
