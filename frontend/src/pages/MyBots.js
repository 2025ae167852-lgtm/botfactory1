import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Paper, Stack } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const MyBots = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', platform: 'whatsapp' });

  // Fetch bots from backend
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/bots`);
        setBots(res.data.bots || []);
      } catch (err) {
        setBots([]);
      }
      setLoading(false);
    };
    fetchBots();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle bot creation
  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/api/bots/create`, form);
      // Refresh bot list
      const res = await axios.get(`${API_URL}/api/bots`);
      setBots(res.data.bots || []);
      setOpen(false);
      setForm({ name: '', platform: 'whatsapp' });
    } catch (err) {
      alert('Failed to create bot');
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>My Bots</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Bot
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Bot</DialogTitle>
        <DialogContent>
          <TextField
            label="Bot Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Platform"
            name="platform"
            value={form.platform}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            SelectProps={{ native: true }}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="messenger">Messenger</option>
            <option value="web">Web</option>
            <option value="multi">Multi</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
      <Stack spacing={2} sx={{ mt: 3 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : bots.length === 0 ? (
          <Typography>No bots found. Create your first bot!</Typography>
        ) : (
          bots.map(bot => (
            <Paper key={bot.id || bot._id} sx={{ p: 2 }}>
              <Typography variant="h6">{bot.name}</Typography>
              <Typography>Platform: {bot.platform}</Typography>
              <Typography>Status: {bot.isActive ? 'Active' : 'Inactive'}</Typography>
            </Paper>
          ))
        )}
      </Stack>
    </Paper>
  );
};

export default MyBots;
