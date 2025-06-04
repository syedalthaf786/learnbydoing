import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

function BackToTop() {
  const [showButton, setShowButton] = useState(false);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  useEffect(() => {
    setShowButton(trigger);
  }, [trigger]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Zoom in={showButton}>
      <Fab
        color="primary"
        size="small"
        aria-label="scroll back to top"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
}

export default BackToTop;