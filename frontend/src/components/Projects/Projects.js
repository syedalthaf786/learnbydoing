import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  // CircularProgress,
  Grid 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useProjects } from '../../context/ProjectContext';
import { useProjectActions } from '../../hooks/useProjectActions';
import { useProjectFilters } from '../../hooks/useProjectFilters';
import ProjectCard from './ProjectCard';
import ProjectFilters from './ProjectFilters';
import ProjectSubmit from './ProjectSubmit';
import Loading1 from 'components/Loading/Loading';
function Projects() {
  const [openSubmit, setOpenSubmit] = useState(false);
  const { state } = useProjects();
  const { fetchProjects, addProject } = useProjectActions();
  const { filteredProjects, filters, updateFilters } = useProjectFilters();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmit = async (project) => {
    try {
      await addProject(project);
      setOpenSubmit(false);
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h3" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenSubmit(true)} disabled
        >
          Add Project
        </Button>
      </Box>

      <ProjectFilters
        search={filters.search}
        category={filters.category}
        status={filters.status}
        setSearch={(search) => updateFilters({ search })}
        setCategory={(category) => updateFilters({ category })}
        setStatus={(status) => updateFilters({ status })}
      />

      {state.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          {/* <CircularProgress /> */}
          <Loading1/>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}

      <ProjectSubmit
        open={openSubmit}
        handleClose={() => setOpenSubmit(false)}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}

export default Projects;