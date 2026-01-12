import React from 'react';
import { Container, Typography } from '@mui/material';

const Team = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Team Collaboration
    </Typography>
    <Typography>
      Invite team members and manage collaboration settings here.
    </Typography>
  </Container>
);

export default Team;
