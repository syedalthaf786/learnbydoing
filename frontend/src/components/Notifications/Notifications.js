import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Avatar,
  IconButton,
  Divider,
  Badge,
  Box,
  Chip,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment,
  Message,
  Event,
  MoreVert,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Loading/Loading';

const mockNotifications = [
  {
    id: 1,
    type: 'course',
    title: 'New Course Available',
    message: 'Advanced React Patterns course is now available',
    timestamp: '2023-08-15T10:30:00Z',
    read: false,
    icon: <Assignment color="primary" />
  },
  {
    id: 2,
    type: 'discussion',
    title: 'New Reply',
    message: 'John Doe replied to your discussion post',
    timestamp: '2023-08-14T15:45:00Z',
    read: true,
    icon: <Message color="info" />
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Course Deadline',
    message: 'JavaScript Fundamentals assignment due tomorrow',
    timestamp: '2023-08-14T09:20:00Z',
    read: false,
    icon: <Event color="warning" />
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications(mockNotifications);
      } catch (err) {
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleMenuOpen = (event, notificationId) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    handleMenuClose();
  };

  const handleDelete = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
    handleMenuClose();
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return <Loading message="Loading notifications..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
          <NotificationsIcon fontSize="large" />
        </Badge>
        <Typography variant="h4">
          Notifications
        </Typography>
      </Box>

      {notifications.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No notifications to display
        </Typography>
      ) : (
        <List>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  transition: 'background-color 0.3s'
                }}
                secondaryAction={
                  <>
                    {!notification.read && (
                      <Chip 
                        size="small" 
                        color="primary" 
                        label="New" 
                        sx={{ mr: 1 }}
                      />
                    )}
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleMenuOpen(e, notification.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    {notification.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        component="div"
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {getTimeAgo(notification.timestamp)}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => handleMarkAsRead(selectedNotification)}
          disabled={notifications.find(n => n.id === selectedNotification)?.read}
        >
          <ListItemIcon>
            <CheckCircle fontSize="small" />
          </ListItemIcon>
          Mark as read
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedNotification)}>
          <ListItemIcon>
            <NotificationsIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Notifications;