import React from 'react';
import StatsOverview from '../components/dashboard/StatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import { Container, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      <StatsOverview />
      <QuickActions />
    </Container>
  );
};

export default Dashboard;
