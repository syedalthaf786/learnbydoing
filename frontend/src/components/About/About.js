import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  Avatar
} from '@mui/material';
import {
  School,
  People,
  Lightbulb,
  Timeline
} from '@mui/icons-material';

const features = [
  {
    icon: <School fontSize="large" />,
    title: 'Quality Education',
    description: 'Access high-quality courses designed by industry experts and educators.'
  },
  {
    icon: <People fontSize="large" />,
    title: 'Community Learning',
    description: 'Join a vibrant community of learners and share knowledge together.'
  },
  {
    icon: <Lightbulb fontSize="large" />,
    title: 'Practical Skills',
    description: 'Gain hands-on experience with real-world projects and exercises.'
  },
  {
    icon: <Timeline fontSize="large" />,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed progress tracking.'
  }
];

const team = [
  {
    name: 'Aashritha',
    role: 'Founder & CEO',
    avatar: '/avatars/john.jpg',
    bio: 'Educational technology expert with 15 years of experience.'
  },
  {
    name: 'Naga Devi',
    role: 'Head of Content',
    avatar: '/avatars/jane.jpg',
    bio: 'Curriculum development specialist and former university professor.'
  },
  {
    name: 'Prudvi Kumar reddy',
    role: 'Technical Lead',
    avatar: '/avatars/mike.jpg',
    bio: 'Software engineer with a passion for educational technology.'
  },
  {
    name: 'S ALTHAF',
    role: 'Developer',
    avatar: '/avatars/mike.jpg',
    bio: 'Software engineer with a passion for educational technology.'
  }
];

function About() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          mb: 6, 
          textAlign: 'center',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText'
        }}
      >
        <Typography variant="h3" gutterBottom>
          About Learn By Doing
        </Typography>
        <Typography variant="h6">
          Empowering learners through practical education and hands-on experience
        </Typography>
      </Paper>

      {/* Mission Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          We believe in making quality education accessible to everyone. Our platform 
          focuses on practical learning experiences that prepare you for real-world challenges.
        </Typography>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          What Sets Us Apart
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Team
        </Typography>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto',
                      mb: 2
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Values Section */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Our Values
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          We are committed to excellence, innovation, and continuous improvement. 
          Our platform is built on the principles of accessibility, quality, and 
          practical learning that makes a real difference in people's lives.
        </Typography>
      </Box>
    </Container>
  );
}

export default About;