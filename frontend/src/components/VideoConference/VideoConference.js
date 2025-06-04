import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Paper, Typography, IconButton, TextField, List, ListItem, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Send,
  Close,
  People,
  Chat
} from '@mui/icons-material';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';

const VideoContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: '#1a1a1a',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
}));

const VideoConference = ({ projectId, onClose }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  
  const localVideoRef = useRef();
  const screenShareRef = useRef();
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const screenStream = useRef(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Join video room
    socket.emit('join-video-room', {
      projectId,
      userId: user._id,
      userName: user.name
    });

    // Handle new participants
    socket.on('participant-joined', handleParticipantJoined);
    socket.on('participant-left', handleParticipantLeft);
    socket.on('current-participants', handleCurrentParticipants);
    
    // Handle WebRTC signaling
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    
    // Handle screen sharing
    socket.on('screen-share-started', handleScreenShareStarted);
    socket.on('screen-share-stopped', handleScreenShareStopped);
    
    // Handle chat messages
    socket.on('new-chat-message', handleNewChatMessage);

    return () => {
      socket.off('participant-joined');
      socket.off('participant-left');
      socket.off('current-participants');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('screen-share-started');
      socket.off('screen-share-stopped');
      socket.off('new-chat-message');
    };
  }, [socket, projectId, user]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const handleParticipantJoined = async ({ socketId, userId, userName }) => {
    setParticipants(prev => [...prev, { socketId, userId, userName }]);
    await createPeerConnection(socketId);
  };

  const handleParticipantLeft = ({ socketId }) => {
    setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    if (peerConnections.current[socketId]) {
      peerConnections.current[socketId].close();
      delete peerConnections.current[socketId];
    }
  };

  const handleCurrentParticipants = (participants) => {
    setParticipants(participants);
    participants.forEach(participant => {
      if (participant.socketId !== socket.id) {
        createPeerConnection(participant.socketId);
      }
    });
  };

  const createPeerConnection = async (targetId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          targetId,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      // Handle incoming video track
      const videoElement = document.createElement('video');
      videoElement.srcObject = event.streams[0];
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      // Add video element to the UI
    };

    peerConnections.current[targetId] = pc;

    // Add local stream tracks to the peer connection
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        pc.addTrack(track, localStream.current);
      });
    }

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', { targetId, offer });

    return pc;
  };

  const handleOffer = async ({ offer, from }) => {
    const pc = await createPeerConnection(from);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', { targetId: from, answer });
  };

  const handleAnswer = async ({ answer, from }) => {
    const pc = peerConnections.current[from];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = async ({ candidate, from }) => {
    const pc = peerConnections.current[from];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const handleScreenShareStarted = ({ from }) => {
    // Handle remote screen share
  };

  const handleScreenShareStopped = ({ from }) => {
    // Handle remote screen share stop
  };

  const handleNewChatMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        screenStream.current = screenStream;
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        socket.emit('start-screen-share', { projectId });
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      if (screenStream.current) {
        screenStream.current.getTracks().forEach(track => track.stop());
        screenStream.current = null;
      }
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
      socket.emit('stop-screen-share', { projectId });
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit('send-chat-message', {
        projectId,
        message: newMessage.trim(),
        userName: user.name
      });
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Video Conference</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Grid container sx={{ flex: 1, p: 2, gap: 2 }}>
        <Grid item xs={showChat || showParticipants ? 9 : 12}>
          <VideoContainer>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {isScreenSharing && (
              <video
                ref={screenShareRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}
          </VideoContainer>
        </Grid>

        {(showChat || showParticipants) && (
          <Grid item xs={3}>
            <Paper sx={{ height: '100%', p: 2 }}>
              {showChat ? (
                <>
                  <Typography variant="h6" gutterBottom>Chat</Typography>
                  <List sx={{ height: 'calc(100% - 120px)', overflow: 'auto' }}>
                    {messages.map((msg, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={msg.userName}
                          secondary={msg.message}
                          primaryTypographyProps={{ variant: 'subtitle2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <IconButton onClick={sendMessage}>
                      <Send />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>Participants</Typography>
                  <List>
                    {participants.map((participant) => (
                      <ListItem key={participant.socketId}>
                        <ListItemText
                          primary={participant.userName}
                          secondary={participant.socketId === socket?.id ? 'You' : ''}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton onClick={toggleMute} color={isMuted ? 'error' : 'primary'}>
          {isMuted ? <MicOff /> : <Mic />}
        </IconButton>
        <IconButton onClick={toggleVideo} color={isVideoOff ? 'error' : 'primary'}>
          {isVideoOff ? <VideocamOff /> : <Videocam />}
        </IconButton>
        <IconButton onClick={toggleScreenShare} color={isScreenSharing ? 'primary' : 'default'}>
          {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
        </IconButton>
        <IconButton onClick={() => setShowParticipants(!showParticipants)}>
          <People />
        </IconButton>
        <IconButton onClick={() => setShowChat(!showChat)}>
          <Chat />
        </IconButton>
      </Box>
    </Box>
  );
};

export default VideoConference; 