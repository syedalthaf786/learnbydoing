import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const AIChat = ({ projectId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = {
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      userName: user.name
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // Add your AI API call here
      // For now, we'll simulate a response
      setTimeout(() => {
        const aiResponse = {
          text: "I'm your AI Code Assistant. How can I help you with your project?",
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">AI Code Assistant</Typography>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            <ListItem
              sx={{
                flexDirection: 'column',
                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  backgroundColor: message.sender === 'user' ? '#1976d2' : '#f5f5f5',
                  color: message.sender === 'user' ? '#fff' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {message.sender === 'user' ? message.userName : 'AI Assistant'}
                </Typography>
                <Typography variant="body1">
                  {message.text}
                </Typography>
              </Paper>
            </ListItem>
            {index < messages.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </List>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask me anything about your code..."
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
            color="primary"
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AIChat; 