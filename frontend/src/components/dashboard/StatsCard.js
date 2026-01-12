import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const StatCard = ({ title, value, change, icon }) => (
  <Card sx={{ minWidth: 200, textAlign: 'center' }}>
    <CardContent>
      <Typography variant="h3" component="div">{icon}</Typography>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
      {change && <Typography color={change.startsWith('+') ? 'green' : 'red'}>{change}</Typography>}
    </CardContent>
  </Card>
);

const StatsOverview = () => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard title="Total Messages" value="1,250" change="+12%" icon="📨" />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard title="Active Bots" value="5" change="+2" icon="🤖" />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard title="Platforms" value="3" icon="🌐" />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard title="Success Rate" value="89%" change="+5%" icon="📈" />
    </Grid>
  </Grid>
);

export default StatsOverview;
