import React from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Quick Actions</Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/bots')}
        >
          CREATE NEW BOT
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/platforms')}
        >
          ADD PLATFORM
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/analytics')}
        >
          VIEW ANALYTICS
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/team')}
        >
          INVITE TEAM
        </Button>
      </Stack>
    </Paper>
  );
};

export default QuickActions;
