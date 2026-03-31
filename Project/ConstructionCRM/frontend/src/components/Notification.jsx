import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notification = ({ open, handleClose, message, severity = "success" }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Поява зверху справа
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        variant="filled" 
        sx={{ width: '100%', borderRadius: '12px' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;