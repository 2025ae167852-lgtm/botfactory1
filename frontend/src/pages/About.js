import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const About = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>About Us</Typography>
      <Typography variant="body1">
        Bot Factory is a no-code, multi-platform bot builder for businesses. Our team is dedicated to making automation accessible, scalable, and secure for everyone.
      </Typography>
    </Paper>
  </Container>
);

export default About;
