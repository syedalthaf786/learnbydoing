import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const DashboardCard = ({ title, value, icon, color }) => (
  <Card>
    <CardHeader
      avatar={
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: 1,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      }
      title={title}
      titleTypographyProps={{ variant: 'subtitle2', color: 'textSecondary' }}
    />
    <CardContent>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const MentorDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mentor Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DashboardCard
            title="Total Students"
            value="24"
            icon={<PeopleIcon color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard
            title="Upcoming Sessions"
            value="5"
            icon={<EventIcon color="secondary" />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard
            title="Average Rating"
            value="4.8"
            icon={<AssessmentIcon color="success" />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography color="textSecondary">
              No recent activity to display.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MentorDashboard; 