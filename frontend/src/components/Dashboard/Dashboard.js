import React from 'react';
import { 
  Container, Grid, Paper, Typography, Box, LinearProgress, Card, CardContent, Button, List, ListItem, ListItemText, Divider, Tooltip
} from '@mui/material';
import { School, Assignment, Timeline, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  
  const enrolledCourses = [
    {
      id: 1,
      title: 'Web Development Bootcamp',
      progress: 65,
      nextLesson: 'React Components',
      lastAccessed: '2024-01-20'
    },
    {
      id: 2,
      title: 'Mobile App Development',
      progress: 30,
      nextLesson: 'UI Design Principles',
      lastAccessed: '2024-01-19'
    }
  ];

  const upcomingAssignments = [
    {
      id: 1,
      title: 'Portfolio Project',
      dueDate: '2024-02-01',
      course: 'Web Development'
    },
    {
      id: 2,
      title: 'Mobile App Wireframe',
      dueDate: '2024-02-05',
      course: 'Mobile App Development'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div initial="hidden" animate="visible" variants={cardVariants}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Welcome back, {user?.name || 'Student'}!
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18 }}>
            Continue your learning journey with us.
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Stats Cards with Animation */}
        {[{ icon: <School />, label: 'Courses', value: 2 },
          { icon: <Assignment />, label: 'Assignments', value: 5 },
          { icon: <Timeline />, label: 'Hours Spent', value: 24 },
          { icon: <Star />, label: 'Achievements', value: 8 }].map((stat, index) => (
          <Grid item xs={12} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper elevation={6} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4, background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                <Tooltip title={stat.label} placement="top">
                  <Box sx={{ fontSize: 40, mb: 1, color: '#1976d2' }}>{stat.icon}</Box>
                </Tooltip>
                <Typography variant="h6">{stat.label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}

        {/* Course Progress Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Course Progress
            </Typography>
            {enrolledCourses.map((course) => (
              <motion.div key={course.id} initial="hidden" animate="visible" variants={cardVariants}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{course.title}</Typography>
                    <Typography variant="body2" color="primary">{course.progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={course.progress} sx={{ height: 8, borderRadius: 5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Next Lesson: {course.nextLesson}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Paper>
        </Grid>

        {/* Upcoming Assignments Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Assignments
            </Typography>
            <List>
              {upcomingAssignments.map((assignment) => (
                <motion.div key={assignment.id} initial="hidden" animate="visible" variants={cardVariants}>
                  <React.Fragment>
                    <ListItem>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`Due: ${assignment.dueDate}`}
                      />
                      <Button variant="contained" color="primary" size="small">
                        View
                      </Button>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                </motion.div>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;