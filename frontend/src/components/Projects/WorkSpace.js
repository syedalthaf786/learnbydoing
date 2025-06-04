import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Badge from '@mui/material/Badge';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import PeopleIcon from '@mui/icons-material/People';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
// Optionally import OpenInNewIcon if using VS Code integration
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { useAuth } from '../../context/AuthContext';
import VideoConference from '../VideoConference/VideoConference';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

// Initialize Google GenAI with your API key
const ai = new GoogleGenAI({ apiKey: "AIzaSyDnEZOA092YEBdA3CYysRgZRIihV4kJxoo" });


function WorkSpace() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Added missing state variables:
  const [loading, setLoading] = useState(false);
  const [vscodeUrl, setVscodeUrl] = useState("");

  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('code');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const videoRef = useRef(null);
  const screenShareRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [fullIframeLoaded, setFullIframeLoaded] = useState(false);
  const [supportMessages, setSupportMessages] = useState([]);
  const [newSupportMessage, setNewSupportMessage] = useState('');

  const drawerWidth = 180;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!projectId || projectId === "unknown") {
      setError("Invalid project ID. Please select a valid project from your dashboard.");
      return;
    }
    if (location.state?.project) {
      const proj = location.state.project;
      if (!proj._id || proj._id === "unknown") {
        setError("Invalid project data. Please complete a project assessment first.");
        return;
      }
      setProject(proj);
    } else {
      fetchProjectData();
    }
  }, [projectId, location.state]);


  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project data');
      const data = await response.json();
      if (!data._id || data._id === "unknown") throw new Error('Invalid project data received from server');
      setProject(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleClearChat = () => {
    setMessages([]); // Clear all messages
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: newMessage, timestamp: Date.now() },
    ]);

    // Clear the input field
    setNewMessage('');

    try {
      // Call Google GenAI to generate a response
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash", // Ensure this model is available in your account
        contents: newMessage,
      });

      // Add the AI's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: response.text, timestamp: Date.now() },
      ]);

      // Scroll to the bottom of the chat
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Error generating content:", error.message || error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: 'Sorry, something went wrong. Please try again.', timestamp: Date.now() },
      ]);
    }
  };

  const handleSendSupportMessage = () => {
    if (!newSupportMessage.trim()) return;
    // Add the user's message to the conversation
    const userMessage = {
      text: newSupportMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setSupportMessages(prev => [...prev, userMessage]);

    // Check if the query is project-related and whether an email is provided
    const emailRegex = /\S+@\S+\.\S+/;
    let replyText = '';
    if (newSupportMessage.toLowerCase().includes('project')) {
      if (emailRegex.test(newSupportMessage)) {
        replyText = "Thank you for providing your email. We will contact you shortly with more details regarding your project query.";
      } else {
        replyText = "It seems you have a query about your project. Please enter your email address so we can follow up with you.";
      }
    } else {
      replyText = "Could you please provide some more details about your query?";
    }

    setNewSupportMessage('');
    setTimeout(() => {
      const supportReply = {
        text: replyText,
        sender: 'support',
        timestamp: new Date().toISOString()
      };
      setSupportMessages(prev => [...prev, supportReply]);
    }, 1000);
  };

  const renderProjectDetails = () => (
    <Card sx={{ mb: 2, bgcolor: '#f0e6e6', border: '1px solid #333', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h5" sx={{ color: '#0a0a0a' }}>
            {project.title}
          </Typography>
          <Chip
            label={project.status1 || 'In Progress'}
            color={project.status === 'Completed' ? 'success' : 'primary'}
            size="small"
          />
        </Box>
        <Typography variant="body2" sx={{ mb: 2, color: '#0a0a0a' }}>
          {project?.description || 'No description provided.'}
        </Typography>
        {project?.technologies?.length > 0 && (
          <Typography variant="body2" sx={{ mb: 2, color: '#0a0a0a' }}>
            Technologies: {project.technologies.join(', ')}
          </Typography>
        )}
        {user && (
          <Typography variant="body2" sx={{ mb: 2, color: '#0a0a0a' }}>
            Your Role: {project.role || (project.roles && user.roles.length > 0 ? user.roles[0].title : 'N/A')}
          </Typography>
        )}
        {/* ...existing code for additional buttons or content... */}
      </CardContent>
    </Card>
  );

  const renderAIChatDialog = () => (
    <Dialog
      open={isAIChatOpen}
      onClose={() => setIsAIChatOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#f0e6e6', // Dark background for the dialog
          color: '#0a0a0a', // White text for better readability
          height: '80vh',
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #333', // Subtle border for separation
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SmartToyIcon sx={{ color: '#4CAF50' }} /> {/* Green icon for AI */}
          <Typography variant="h6">AI Doc Assistant</Typography>
        </Box>
        <Button
            variant="outlined"
            color="error"
            onClick={handleClearChat}
            sx={{
              color: '#0a0a0a',
              borderColor: '#f44336',
              '&:hover': { bgcolor: '#f44336', color: '#fff' },
            }}
          >
            Clear Chat
          </Button>
        <IconButton onClick={() => setIsAIChatOpen(false)} color="inherit">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          display: 'flex',
          height: 'calc(80vh - 140px)', // Adjust height for content
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1,
                }}
              >
                {message.sender === 'ai' && (
                  <Avatar sx={{ bgcolor: '#4CAF50' }}>
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: message.sender === 'user' ? '#1976d2' : '#333', // Blue for user, dark gray for AI
                    color: '#fff',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Box */}
          <Box
            sx={{
              p: 2,
              backgroundColor: '#2d2d2d', // Slightly lighter background for input area
              borderTop: '1px solid #333',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask me anything about your code..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff', // White text for input
                    '& fieldset': { borderColor: '#333' }, // Dark border
                    '&:hover fieldset': { borderColor: '#666' }, // Lighter border on hover
                    '&.Mui-focused fieldset': { borderColor: '#4CAF50' }, // Green border when focused
                  },
                }}
              />
              <Fab
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  bgcolor: '#4CAF50', // Green background for send button
                  '&:hover': { bgcolor: '#45a049' }, // Darker green on hover
                }}
              >
                <SendIcon />
              </Fab>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const renderChatSupport = () => (
    <Paper
      sx={{
        p: 3,
        backgroundColor: '#f0e6e6',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid #333',
        borderRadius: 2
      }}
    >
      {/* Clear Chat Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button
          variant="text"
          color="secondary"
          onClick={() => setSupportMessages([])}
        >
          Clear Chat
        </Button>
      </Box>
      <Box sx={{ overflowY: 'auto', flexGrow: 1, mb: 2 }}>
        {supportMessages.length > 0 ? (
          supportMessages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                mb: 1,
                textAlign: msg.sender === 'support' ? 'left' : 'right'
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#fff',
                  display: 'inline-block',
                  p: 1,
                  bgcolor: msg.sender === 'support' ? '#333' : '#1976d2',
                  borderRadius: 1
                }}
              >
                {msg.text}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            No messages yet. Start by asking a project-related question.
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newSupportMessage}
          onChange={(e) => setNewSupportMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendSupportMessage()}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#0a0a0a',
              '& fieldset': { borderColor: '#333' },
              '&:hover fieldset': { borderColor: '#666' },
              '&.Mui-focused fieldset': { borderColor: '#4CAF50' }
            },
          }}
        />
        <Fab
          color="primary"
          onClick={handleSendSupportMessage}
          disabled={!newSupportMessage.trim()}
          sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
        >
          <SendIcon />
        </Fab>
      </Box>
    </Paper>
  );

  const renderSidebar = () => (
    <Drawer
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#1e1e1e', color: '#fff', borderRight: '1px solid #333' }
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Project
          </Typography>
          <Typography variant="body1" noWrap>{project?.title}</Typography>
        </Box>
        <List sx={{ flex: 1, py: 1 }}>
          <ListItem
            button
            onClick={() => setSelectedTab('code')}
            selected={selectedTab === 'code'}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#4CAF50' }
              }
            }}>
            <ListItemIcon>
              <CodeIcon sx={{ color: selectedTab === 'code' ? '#4CAF50' : '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Code Editor" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedTab === 'code' ? 500 : 400 }} />
          </ListItem>
          <ListItem
            button
            onClick={() => { setSelectedTab('video'); setIsVideoOpen(true); initializeVideoCall(); }}
            selected={selectedTab === 'video' || isVideoOpen}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#4CAF50' }
              }
            }}>
            <ListItemIcon>
              <VideocamIcon sx={{ color: selectedTab === 'video' || isVideoOpen ? '#4CAF50' : '#fff' }} />
            </ListItemIcon>
            <ListItemText
              primary="Video Conference"
              secondary={isVideoOpen ? `${participants.length} participants` : ''}
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedTab === 'video' || isVideoOpen ? 500 : 400 }}
              secondaryTypographyProps={{ fontSize: '0.75rem', color: '#4CAF50' }}
            />
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedTab('docs')}
            selected={selectedTab === 'docs'}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#4CAF50' }
              }
            }}>
            <ListItemIcon>
              <DescriptionIcon sx={{ color: selectedTab === 'docs' ? '#4CAF50' : '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Documentation" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedTab === 'docs' ? 500 : 400 }} />
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: '#333', my: 1 }} />
        <List sx={{ py: 1 }}>
          <ListItem
            button
            onClick={() => { setSelectedTab('ai'); setIsAIChatOpen(true); }}
            selected={selectedTab === 'ai'}>
            <ListItemIcon>
              <SmartToyIcon sx={{ color: selectedTab === 'ai' ? '#4CAF50' : '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="AI Code Assistant" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedTab === 'ai' ? 500 : 400 }} />
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedTab('chat')}
            selected={selectedTab === 'chat'}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(244, 241, 241, 0.92)',
                '&:hover': { backgroundColor: 'rgba(247, 243, 243, 0.93)' },
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#4CAF50' }
              }
            }}>
            <ListItemIcon>
              <ChatIcon sx={{ color: selectedTab === 'chat' ? '#4CAF50' : '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Chat Support" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedTab === 'chat' ? 500 : 400 }} />
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: '#333', my: 1 }} />
        <List sx={{ py: 1 }}>
          <ListItem
            button
            onClick={() => setSelectedTab('settings')}
            selected={selectedTab === 'settings'}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#4CAF50' }
              }
            }}>
            <ListItemIcon>
              <SettingsIcon sx={{ color: selectedTab === 'settings' ? '#4CAF50' : '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedTab === 'settings' ? 500 : 400 }} />
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedTab('help')}
            selected={selectedTab === 'help'}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#4CAF50' }
              }
            }}>
            <ListItemIcon>
              <HelpIcon sx={{ color: selectedTab === 'help' ? '#4CAF50' : '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Help" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedTab === 'help' ? 500 : 400 }} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  const initializeVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setParticipants([
        { id: 1, name: 'You', isHost: true },
        { id: 2, name: 'John Doe', isHost: false },
        { id: 3, name: 'Jane Smith', isHost: false }
      ]);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera or microphone. Please check your permissions.');
    }
  };

  const endVideoCall = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (screenShareRef.current?.srcObject) {
      screenShareRef.current.srcObject.getTracks().forEach(track => track.stop());
      screenShareRef.current.srcObject = null;
    }
    setParticipants([]);
    setIsScreenSharing(false);
  };

  const handleVideoToggle = () => {
    if (!isVideoOpen) {
      initializeVideoCall();
    } else {
      endVideoCall();
    }
    setIsVideoOpen(!isVideoOpen);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (videoRef.current?.srcObject) {
      const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(prev => !prev);
    if (videoRef.current?.srcObject) {
      const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (screenShareRef.current) screenShareRef.current.srcObject = screenStream;
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
        setError('Failed to share screen. Please try again.');
      }
    } else {
      if (screenShareRef.current?.srcObject) {
        screenShareRef.current.srcObject.getTracks().forEach(track => track.stop());
        screenShareRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
    }
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" action={<Button color="inherit" size="small" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>}>
          Project not found. Please select a project from your dashboard.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#1e1e1e' }}>
      <>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1e1e1e' }}>
          <Toolbar sx={{ minHeight: '64px !important' }}>
            <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontSize: '1.1rem', fontWeight: 500 }}>
              {project?.title}
            </Typography>
          </Toolbar>
        </AppBar>
        {renderSidebar()}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '64px',
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: '#1e1e1e' },
            '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb:hover': { background: '#444' }
          }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid item xs={12} sx={{ mb: 2 }}>
              {renderProjectDetails()}
            </Grid>
            <Grid item xs={12} sx={{ height: 'calc(100% - 200px)', minHeight: '400px' }}>
              {selectedTab === 'code' ? (
                <Box sx={{ position: 'relative', height: '100%', bgcolor: '#2d2d2d', borderRadius: 2, overflow: 'hidden', border: '1px solid #333' }}>
                  {/* Full Screen Button */}
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
                    onClick={handleFullScreenToggle}
                    color="inherit"
                  >
                    <FullscreenIcon />
                  </IconButton>
                  {!iframeLoaded && (
                    <Box sx={{
                      position: 'absolute', top: 0, left: 0,
                      width: '100%', height: '100%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: '#2d2d2d', zIndex: 1
                    }}>
                      {/* <CircularProgress color="primary" /> */}
                      <button
                        onClick={handleFullScreenToggle}
                        style={{ backgroundColor: 'green', color: 'white', cursor: 'pointer' }}
                      >
                        Open Editor
                      </button>
                    </Box>
                  )}
                  <iframe
                    // src="http://localhost:4000/code"
                    onLoad={() => setIframeLoaded(true)}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="VS Code Editor" />
                </Box>
              ) : selectedTab === 'ai' ? (
                renderAIChatDialog()
              ) : selectedTab === 'chat' ? (
                renderChatSupport()
              ) : (
                <Paper sx={{ p: 3, backgroundColor: '#2d2d2d', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 2, border: '1px solid #333' }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Section
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This section is under development. Please check back later.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      </>

      {isFullScreen && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, bgcolor: '#1e1e1e' }}>
          <AppBar position="fixed" sx={{ zIndex: 9999, bgcolor: '#1e1e1e', borderBottom: '1px solid #333' }}>
            <Toolbar sx={{ minHeight: '64px !important' }}>
              <IconButton edge="start" color="inherit" onClick={handleFullScreenToggle} sx={{ mr: 2 }}>
                <FullscreenExitIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontSize: '1.1rem', fontWeight: 500 }}>
                {project?.title} - Full Screen Mode
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ position: 'relative', height: '100vh', pt: '64px' }}>
            {!fullIframeLoaded && (
              <Box sx={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#1e1e1e', zIndex: 1
              }}>
                <CircularProgress color="primary" />
              </Box>
            )}
            <iframe
              src="http://localhost:5173/editor/default"
              onLoad={() => setFullIframeLoaded(true)}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="VS Code Server" />
          </Box>
        </Box>
      )}
      {renderAIChatDialog()}
      {/* Video Conference Dialog */}
      <Dialog
        open={isVideoOpen}
        onClose={handleVideoToggle}
        maxWidth="xl"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1e1e1e', color: '#fff', height: '90vh', maxHeight: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">Video Conference</Typography>
            <Chip label={`${participants.length} Participants`} size="small" sx={{ bgcolor: '#4CAF50', color: '#fff' }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Toggle Participants List">
              <IconButton onClick={() => setShowParticipants(prev => !prev)} color={showParticipants ? 'primary' : 'inherit'}>
                <Badge badgeContent={participants.length} color="primary">
                  <PeopleIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleVideoToggle} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', height: 'calc(90vh - 140px)' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, gap: 2, overflow: 'hidden' }}>
            <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, overflow: 'auto', p: 1 }}>
              <Box sx={{ position: 'relative', aspectRatio: '16/9', bgcolor: '#2d2d2d', borderRadius: 2, overflow: 'hidden', border: '2px solid #4CAF50' }}>
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.5)', px: 1, py: 0.5, borderRadius: 1 }}>
                  <Typography variant="body2">You</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isMuted && <MicOffIcon sx={{ color: '#ff4444' }} />}
                    {!isVideoOn && <VideocamOffIcon sx={{ color: '#ff4444' }} />}
                  </Box>
                </Box>
              </Box>
              {participants.filter(p => p.id !== 1).map(participant => (
                <Box key={participant.id} sx={{ position: 'relative', aspectRatio: '16/9', bgcolor: '#2d2d2d', borderRadius: 2, overflow: 'hidden', border: '2px solid #333' }}>
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1a1a1a' }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: '#4CAF50' }}>{participant.name[0]}</Avatar>
                  </Box>
                  <Box sx={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.5)', px: 1, py: 0.5, borderRadius: 1 }}>
                    <Typography variant="body2">{participant.name}</Typography>
                    {participant.isHost && (
                      <Chip label="Host" size="small" sx={{ bgcolor: '#4CAF50', color: '#fff' }} />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 2, bgcolor: '#2d2d2d', borderRadius: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <ButtonGroup variant="contained" sx={{ bgcolor: '#1e1e1e', '& .MuiButton-root': { color: '#fff', borderColor: '#333', '&:hover': { bgcolor: '#3d3d3d', borderColor: '#444' } } }}>
                <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                  <IconButton onClick={toggleMute} color={isMuted ? 'error' : 'inherit'} sx={{ color: '#fff' }}>
                    {isMuted ? <MicOffIcon /> : <MicIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}>
                  <IconButton onClick={toggleVideo} color={!isVideoOn ? 'error' : 'inherit'} sx={{ color: '#fff' }}>
                    {!isVideoOn ? <VideocamOffIcon /> : <VideocamIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isScreenSharing ? "Stop Sharing" : "Share Screen"}>
                  <IconButton onClick={toggleScreenShare} color={isScreenSharing ? 'primary' : 'inherit'} sx={{ color: '#fff' }}>
                    {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </Box>
          </Box>
          {showParticipants && (
            <Box sx={{ width: 300, borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
                <Typography variant="h6">Participants</Typography>
              </Box>
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <List>
                  {participants.map(participant => (
                    <ListItem key={participant.id} sx={{ bgcolor: participant.isHost ? 'rgba(76,175,80,0.1)' : 'transparent', borderRadius: 1, mb: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: participant.isHost ? '#4CAF50' : '#1976d2' }}>{participant.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={participant.name} secondary={participant.isHost ? 'Host' : 'Participant'} primaryTypographyProps={{ color: participant.isHost ? '#4CAF50' : '#fff' }} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Message">
                          <IconButton size="small" sx={{ color: '#fff' }}>
                            <ChatIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Options">
                          <IconButton size="small" sx={{ color: '#fff' }}>
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box sx={{ p: 2, borderTop: '1px solid #333' }}>
                <Button fullWidth variant="contained" color="primary" startIcon={<ChatIcon />}>
                  Open Chat
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default WorkSpace;
