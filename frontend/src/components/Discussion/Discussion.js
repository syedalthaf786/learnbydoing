import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import { MoreVert, Send } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Loading/Loading';

const mockDiscussions = [
  {
    id: 1,
    user: 'John Doe',
    avatar: '/avatars/john.jpg',
    message: 'Has anyone completed the React project in Module 3?',
    timestamp: '2023-08-10T10:30:00Z',
    replies: [
      {
        id: 101,
        user: 'Jane Smith',
        avatar: '/avatars/jane.jpg',
        message: 'Yes, I found it challenging but rewarding!',
        timestamp: '2023-08-10T11:15:00Z'
      }
    ]
  },
  {
    id: 2,
    user: 'Sarah Wilson',
    avatar: '/avatars/sarah.jpg',
    message: 'Looking for study partners for the JavaScript course.',
    timestamp: '2023-08-09T15:45:00Z',
    replies: []
  },
  {
    id: 3,
    user: 'Mike Brown',
    avatar: '/avatars/mike.jpg',
    message: 'Great resources in the Node.js section!',
    timestamp: '2023-08-08T09:20:00Z',
    replies: []
  }
];

const Discussion = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages(mockDiscussions);
      } catch (err) {
        setError(err.message || 'Failed to load discussions');
      } finally {
        setLoading(false);
      }
    };

    loadDiscussions();
  }, []);

  const handleMenuOpen = (event, messageId) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newDiscussion = {
      id: Date.now(),
      user: user.displayName || 'Anonymous',
      avatar: user.photoURL || '/avatars/default.jpg',
      message: newMessage,
      timestamp: new Date().toISOString(),
      replies: []
    };

    setMessages([newDiscussion, ...messages]);
    setNewMessage('');
  };

  if (loading) {
    return <Loading message="Loading discussions..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Discussion Forum
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Start a discussion..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<Send />}
              disabled={!newMessage.trim()}
            >
              Post
            </Button>
          </Box>
        </form>
      </Paper>

      <List>
        {messages.map((discussion) => (
          <React.Fragment key={discussion.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <IconButton onClick={(e) => handleMenuOpen(e, discussion.id)}>
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={discussion.avatar} alt={discussion.user}>
                  {discussion.user.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={discussion.user}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {discussion.message}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {new Date(discussion.timestamp).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {discussion.replies.length > 0 && (
              <List component="div" disablePadding>
                {discussion.replies.map((reply) => (
                  <ListItem
                    key={reply.id}
                    alignItems="flex-start"
                    sx={{ pl: 4 }}
                  >
                    <ListItemAvatar>
                      <Avatar src={reply.avatar} alt={reply.user}>
                        {reply.user.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={reply.user}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {reply.message}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {new Date(reply.timestamp).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        <MenuItem onClick={handleMenuClose}>Report</MenuItem>
      </Menu>
    </Container>
  );
};

export default Discussion;