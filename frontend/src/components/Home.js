import React  from 'react';
import { Container, Typography, Button, Grid, Paper, Box, Card, CardContent } from '@mui/material';
import { School, Code, Group, Timeline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // 🚀 Import Framer Motion
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Typewriter } from 'react-simple-typewriter';
import { useAuth } from '../context/AuthContext';
function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate('/courses');
    } else {
      navigate('/login');
    }
  };
  const features = [
    {
      icon: <School fontSize="large" />,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience'
    },
    {
      icon: <Code fontSize="large" />,
      title: 'Practical Projects',
      description: 'Build real-world applications and enhance your portfolio'
    },
    {
      icon: <Group fontSize="large" />,
      title: 'Collaborative Learning',
      description: 'Join study groups and learn with peers worldwide'
    },
    {
      icon: <Timeline fontSize="large" />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics'
    }
  ];
  const RocketLogo = () => (
    <motion.div
      // whileHover={{ y: -5, rotate: -10 }} // 🚀 Slight lift & tilt on hover
      whileTap={{ scale: 0.5 }} // 🚀 Shrinks slightly when clicked
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <RocketLaunchIcon sx={{ fontSize: 30, color: 'white' }} />
    </motion.div>
  );
  return (
    <Box style={{ padding:0 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Learn By Doing
              </Typography>
             
    <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold',background: 'linear-gradient(90deg, #fff200, #ffd700, #ffae42)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent', }}>
      <Typewriter
        words={[
          'Master new skills through hands-on experience with real-world projects',
          'Collaborate and build real applications from scratch',
          'Turn your knowledge into real-world expertise',
          'Level up your skills with interactive, project-based learning'
        ]}
        loop={true}  // Keep looping through the words
        cursor
        cursorStyle="|"
        typeSpeed={50}
        deleteSpeed={30}
        delaySpeed={2000}  // Delay before switching to the next phrase
      />
    </Typography>
<div>
              <Button 
                variant="contained" 
                size="large" 
                onClick={handleClick}
                sx={{
                  bgcolor: 'white',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'grey.50'
                  }
                }}
              >
                <RocketLogo />Start Learning
              </Button>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-image.png"
                alt="Learning illustration"
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  display: 'block',
                  margin: 'auto'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
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
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            {[
              { number: '1000+', label: 'Students' },
              { number: '50+', label: 'Courses' },
              { number: '200+', label: 'Projects' },
              { number: '95%', label: 'Success Rate' }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    bgcolor: 'white'
                  }}
                >
                  <Typography 
                    variant="h3" 
                    color="primary.main"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;