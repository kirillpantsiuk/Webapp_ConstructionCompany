import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Paper, Chip, IconButton, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../../../utils/api';

export default function ForemanDashboard() {
  const [teams, setTeams] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTeamId, setEditTeamId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    members: []
  });

  // Завантажити список бригад і доступних працівників
  useEffect(() => {
    fetchTeams();
    fetchBuilders();
  }, []);

  const fetchTeams = async () => {
    const { data } = await api.get('/teams');
    setTeams(data);
  };

  const fetchBuilders = async () => {
    const { data } = await api.get('/users?role=builder'); // створити відповідний ендпоінт або змінити тут
    setWorkers(data);
  };

  const handleOpen = (team = null) => {
    if (team) {
      setForm({ name: team.name, members: team.members.map(m => m._id) });
      setEditTeamId(team._id);
    } else {
      setForm({ name: '', members: [] });
      setEditTeamId(null);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (editTeamId) {
      await api.put(`/teams/${editTeamId}`, form);
    } else {
      await api.post('/teams', form);
    }
    fetchTeams();
    setOpen(false);
  };

  const handleDelete = async id => {
    await api.delete(`/teams/${id}`);
    fetchTeams();
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        🧱 Управління бригадами
      </Typography>

      <Button variant="contained" onClick={() => handleOpen()}>Створити бригаду</Button>

      {/* Таблиця/Картки */}
      <Grid container spacing={2} mt={2}>
        {teams.map(team => (
          <Grid item xs={12} md={6} key={team._id}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{team.name}</Typography>
                <Box>
                  <IconButton onClick={() => handleOpen(team)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(team._id)}><Delete /></IconButton>
                </Box>
              </Box>
              <Typography variant="body2" mt={1}>Працівники:</Typography>
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {team.members.map(user => (
                  <Chip key={user._id} label={user.username} />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Діалог */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editTeamId ? 'Редагувати бригаду' : 'Нова бригада'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Назва бригади" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Учасники</InputLabel>
            <Select
              multiple
              value={form.members}
              onChange={e => setForm(prev => ({ ...prev, members: e.target.value }))}
              label="Учасники"
            >
              {workers.map(user => (
                <MenuItem key={user._id} value={user._id}>{user.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Скасувати</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editTeamId ? 'Оновити' : 'Створити'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
