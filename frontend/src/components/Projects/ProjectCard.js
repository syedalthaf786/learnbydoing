import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  CardActions,
  Tooltip,
  Button
} from '@mui/material';
import { GitHub, Launch, Lock, ArrowForward } from '@mui/icons-material';

function ProjectCard({ project }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    console.log('Navigating to project:', project._id); // Debug log
    navigate(`/projects/${project._id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)'
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={project.image}
        alt={project.title}
        sx={{ cursor: 'pointer' }}
        onClick={handleViewDetails}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          gutterBottom 
          variant="h5" 
          component="h2"
          sx={{ cursor: 'pointer' }}
          onClick={handleViewDetails}
        >
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {project.description}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={project.category} 
            color="primary" 
            size="small" 
            sx={{ mr: 1, mb: 1 }}
          />
          {project.technologies.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              variant="outlined"
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          {project.githubUrl && (
            <Tooltip title="View Code">
              <IconButton 
                href={project.githubUrl} 
                target="_blank"
                color="primary"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
          )}
          {project.demoUrl && (
            <Tooltip title="Live Demo">
              <IconButton 
                href={project.demoUrl} 
                target="_blank"
                color="secondary"
              >
                <Launch />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleViewDetails}
          size="small"
        >
          View Roles
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProjectCard;