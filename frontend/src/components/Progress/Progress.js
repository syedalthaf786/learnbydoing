import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle,
  PlayCircleFilled,
  AccessTime,
  Timeline
} from '@mui/icons-material';

const mockProgress = {
  overallProgress: 65,
  coursesCompleted: 3,
  totalCourses: 5,
  hoursSpent: 45,
  currentCourses: [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      progress: 80,
      lastAccessed: '2023-08-10T15:30:00Z',
      completedModules: 8,
      totalModules: 10
    },
    {
      id: 2,
      title: 'React.js Advanced Concepts',
      progress: 45,
      lastAccessed: '2023-08-09T14:20:00Z',
      completedModules: 4,
      totalModules: 12
    }
  ]
};

function Progress() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Learning Progress
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={mockProgress.overallProgress}
                    size={80}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" component="div" color="text.secondary">
                      {`${Math.round(mockProgress.overallProgress)}%`}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Completed {mockProgress.coursesCompleted} of {mockProgress.totalCourses} courses
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mockProgress.hoursSpent} hours spent learning
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom>
            Current Courses
          </Typography>
          {mockProgress.currentCourses.map((course) => (
            <Card key={course.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress: {course.progress}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={course.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    icon={<CheckCircle />}
                    label={`${course.completedModules}/${course.totalModules} modules`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<AccessTime />}
                    label={`Last accessed: ${new Date(course.lastAccessed).toLocaleDateString()}`}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PlayCircleFilled />
                  </ListItemIcon>
                  <ListItemText
                    primary="Completed Module 5"
                    secondary="Web Development Fundamentals"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline />
                  </ListItemIcon>
                  <ListItemText
                    primary="Quiz Score: 90%"
                    secondary="React.js Advanced Concepts"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Progress;