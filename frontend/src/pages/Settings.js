import React from 'react';
import { Container, Typography } from '@mui/material';

const Settings = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Settings
    </Typography>
    <Typography>
      Manage your account, preferences, and bot settings here.
    </Typography>
  </Container>
);

export default Settings;
