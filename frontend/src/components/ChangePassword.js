import React, { useState } from 'react';
import authService from '../api/authService';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Not logged in.');
        return;
      }
      const response = await authService.post('/change_password', { new_password: newPassword }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setMessage('Password changed successfully. Please login again.');
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`Error changing password: ${error.response.data.message}`);
      } else {
        setMessage('Error changing password: An unexpected error occurred.');
      }
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Change Password
      </Typography>
      {message && (
        <Alert
          severity={message.startsWith('Password changed successfully') ? 'success' : 'error'}
          style={{ marginBottom: '20px' }}
        >
          {message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '20px' }}>
          Change Password
        </Button>
      </form>
    </Container>
  );
}

export default ChangePassword;
