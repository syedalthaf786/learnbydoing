import React from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { motion } from 'framer-motion';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

function Loading({ 
  message = 'Launching...', 
  fullScreen = false,
  delay = 500,
  minHeight = '200px'
}) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const rocketAnimation = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: [-10, -20, -10, 0], 
      opacity: 1,
      transition: { repeat: Infinity, duration: 1 }
    }
  };

  return (
    <Fade in={visible} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          minHeight: fullScreen ? '100vh' : minHeight,
          width: '100%',
          position: fullScreen ? 'fixed' : 'relative',
          top: fullScreen ? 0 : 'auto',
          left: fullScreen ? 0 : 'auto',
          backgroundColor: fullScreen ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          zIndex: fullScreen ? 9999 : 1
        }}
      >
        <motion.div variants={rocketAnimation} initial="initial" animate="animate">
          <RocketLaunchIcon sx={{ fontSize: 50, color: 'primary.main' }} />
        </motion.div>
        <Typography 
          color="text.secondary" 
          variant="body1"
          sx={{
            mt: 2,
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: '80%'
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
}

export default Loading;
