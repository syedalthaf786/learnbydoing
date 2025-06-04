const socketIO = require('socket.io');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Store active video rooms
  const videoRooms = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a video room
    socket.on('join-video-room', ({ projectId, userId, userName }) => {
      const roomId = `video-room-${projectId}`;
      socket.join(roomId);

      // Store user info in the room
      if (!videoRooms.has(roomId)) {
        videoRooms.set(roomId, new Map());
      }
      videoRooms.get(roomId).set(socket.id, { userId, userName });

      // Notify others in the room about the new participant
      socket.to(roomId).emit('participant-joined', {
        socketId: socket.id,
        userId,
        userName
      });

      // Send current participants to the new user
      const participants = Array.from(videoRooms.get(roomId).entries()).map(([id, data]) => ({
        socketId: id,
        ...data
      }));
      socket.emit('current-participants', participants);
    });

    // Handle WebRTC signaling
    socket.on('offer', ({ targetId, offer }) => {
      socket.to(targetId).emit('offer', {
        offer,
        from: socket.id
      });
    });

    socket.on('answer', ({ targetId, answer }) => {
      socket.to(targetId).emit('answer', {
        answer,
        from: socket.id
      });
    });

    socket.on('ice-candidate', ({ targetId, candidate }) => {
      socket.to(targetId).emit('ice-candidate', {
        candidate,
        from: socket.id
      });
    });

    // Handle screen sharing
    socket.on('start-screen-share', ({ projectId }) => {
      const roomId = `video-room-${projectId}`;
      socket.to(roomId).emit('screen-share-started', {
        from: socket.id
      });
    });

    socket.on('stop-screen-share', ({ projectId }) => {
      const roomId = `video-room-${projectId}`;
      socket.to(roomId).emit('screen-share-stopped', {
        from: socket.id
      });
    });

    // Handle chat messages
    socket.on('send-chat-message', ({ projectId, message, userName }) => {
      const roomId = `video-room-${projectId}`;
      io.to(roomId).emit('new-chat-message', {
        message,
        userName,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Find and remove user from all rooms
      for (const [roomId, participants] of videoRooms.entries()) {
        if (participants.has(socket.id)) {
          const userData = participants.get(socket.id);
          participants.delete(socket.id);
          
          // Notify others in the room
          socket.to(roomId).emit('participant-left', {
            socketId: socket.id,
            userId: userData.userId,
            userName: userData.userName
          });

          // Clean up empty rooms
          if (participants.size === 0) {
            videoRooms.delete(roomId);
          }
          break;
        }
      }
    });
  });

  return io;
};

module.exports = initializeSocket; 