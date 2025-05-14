import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Email</Typography>
          <Typography>{user?.email}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 