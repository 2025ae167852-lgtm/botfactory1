import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box, Stack, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import AssessmentIcon from '@mui/icons-material/Assessment';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SecurityIcon from '@mui/icons-material/Security';
import WidgetsIcon from '@mui/icons-material/Widgets';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', pb: 6 }}>
      <Box sx={{ bgcolor: '#4F46E5', py: 6, color: 'white', mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Bot Factory
          </Typography>
          <Typography variant="h5" gutterBottom>
            No-code, multi-platform bot builder for WhatsApp, Telegram, Messenger, and Web.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Create, deploy, and manage automated conversation bots across multiple platforms from a single visual dashboard.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="secondary" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/about')}>
              About Us
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                <WidgetsIcon sx={{ mr: 1, color: '#4F46E5' }} />
                Features
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ChatIcon color="primary" />
                  <Typography>User authentication (login/register)</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AssessmentIcon color="primary" />
                  <Typography>Dashboard with live statistics</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GroupWorkIcon color="primary" />
                  <Typography>Visual bot flow editor</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IntegrationInstructionsIcon color="primary" />
                  <Typography>Multi-platform bot deployment</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AssessmentIcon color="primary" />
                  <Typography>Message analytics</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GroupWorkIcon color="primary" />
                  <Typography>Team collaboration</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SecurityIcon color="primary" />
                  <Typography>Production-ready with error handling</Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                <IntegrationInstructionsIcon sx={{ mr: 1, color: '#10B981' }} />
                Platform Integrations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Typography>WhatsApp Business</Typography>
                <Typography>Telegram Bot</Typography>
                <Typography>Facebook Messenger</Typography>
                <Typography>Web Chat Widget</Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Tech Stack
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2">
                <strong>Backend:</strong> Node.js, Express, MongoDB, Socket.io<br />
                <strong>Frontend:</strong> React, Material-UI, React Flow<br />
                <strong>APIs:</strong> RESTful endpoints, JWT authentication
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Quick Navigation
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Button variant="outlined" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                <Button variant="outlined" onClick={() => navigate('/bots')}>My Bots</Button>
                <Button variant="outlined" onClick={() => navigate('/platforms')}>Platform Integrations</Button>
                <Button variant="outlined" onClick={() => navigate('/analytics')}>Analytics</Button>
                <Button variant="outlined" onClick={() => navigate('/settings')}>Settings</Button>
                <Button variant="outlined" onClick={() => navigate('/team')}>Team Collaboration</Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>About Us</Typography>
            <Typography variant="body1">
              Bot Factory empowers businesses with easy-to-use, powerful automation tools for customer engagement.
              Our mission is to simplify bot creation and deployment across all major messaging platforms, enabling teams to focus on what matters most—delivering great customer experiences.
            </Typography>
          </Paper>
        </Box>
      </Container>

      <Box sx={{ bgcolor: '#1F2937', color: '#F9FAFB', py: 3, mt: 6 }}>
        <Container maxWidth="lg">
          <Typography align="center" variant="body2">
            &copy; {new Date().getFullYear()} Bot Factory &mdash; All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
