import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Button, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const platformLabels = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  messenger: 'Messenger',
  web: 'Web'
};

const Platforms = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'whatsapp', token: '' });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/platforms`);
      setPlatforms(res.data.platforms || []);
    } catch {
      setPlatforms([]);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    try {
      await axios.post(`${API_URL}/api/platforms/add`, form);
      setFeedback('Platform added successfully!');
      setOpen(false);
      setForm({ type: 'whatsapp', token: '' });
      fetchPlatforms();
    } catch {
      setFeedback('Failed to add platform.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Platform Integrations
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
        Add Platform
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Platform</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Platform"
            name="type"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            SelectProps={{ native: true }}
            fullWidth
            margin="normal"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="messenger">Messenger</option>
            <option value="web">Web</option>
          </TextField>
          <TextField
            label="Token / API Key"
            name="token"
            value={form.token}
            onChange={e => setForm({ ...form, token: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      {feedback && (
        <Typography color={feedback.includes('success') ? 'green' : 'red'} sx={{ mb: 2 }}>
          {feedback}
        </Typography>
      )}
      <Stack spacing={2}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : platforms.length === 0 ? (
          <Typography>No platforms connected. Add one!</Typography>
        ) : (
          platforms.map(p => (
            <Paper key={p.type} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">{platformLabels[p.type] || p.type}</Typography>
              <Chip
                label={p.status === 'connected' ? 'Connected' : 'Not Connected'}
                color={p.status === 'connected' ? 'success' : 'error'}
              />
            </Paper>
          ))
        )}
      </Stack>
    </Container>
  );
};

export default Platforms;
