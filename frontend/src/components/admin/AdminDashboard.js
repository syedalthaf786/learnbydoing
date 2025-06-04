import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalAssignments: 0,
    activeUsers: 0,
    recentUsers: [],
    recentActivities: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    // /fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      const data = await response.json();
      setStats({
        ...data,
        loading: false,
        error: null
      });
    } catch (error) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: color }}>
            {icon}
          </Avatar>
        </Box>
        <Typography variant="h4">
          {stats.loading ? <CircularProgress size={20} /> : value}
        </Typography>
      </CardContent>
    </Card>
  );

  const RecentActivity = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        {stats.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {stats.recentActivities?.map((activity, index) => (
              <ListItem
                key={index}
                divider={index < stats.recentActivities.length - 1}
                secondaryAction={
                  <IconButton edge="end" size="small">
                    <ArrowForwardIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={activity.description}
                  secondary={new Date(activity.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const RecentUsers = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Users
        </Typography>
        {stats.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {stats.recentUsers?.map((user, index) => (
              <ListItem
                key={user._id}
                divider={index < stats.recentUsers.length - 1}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={
                    <>
                      {user.email}
                      <Chip
                        size="small"
                        label={user.role}
                        color={user.role === 'admin' ? 'error' : user.role === 'mentor' ? 'warning' : 'primary'}
                        sx={{ ml: 1 }}
                      />
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  if (stats.error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {stats.error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={<SchoolIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assignments"
            value={stats.totalAssignments}
            icon={<AssignmentIcon />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={<TrendingUpIcon />}
            color="info.main"
          />
        </Grid>

        {/* Recent Users and Activity */}
        <Grid item xs={12} md={6}>
          <RecentUsers />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard; 