import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Stack,
  TextField,
  Paper,
  Divider,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useAuth } from './context/useAuth';
import { Link } from 'react-router-dom';

export default function Register() {
  const { register, loading } = useAuth();
  const [error, setError] = useState(null);
  const [type, setType] = useState('band'); // 'band' or 'venue'

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: '',
    city_id: '',
    capacity: '', // venue only
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTypeChange = (_, newType) => {
    if (newType !== null) setType(newType);
  };

  const handleRegister = async () => {
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
      description: form.description,
      city_id: form.city_id,
      ...(type === 'venue' && { capacity: form.capacity }),
      type,
    };

    try {
      await register(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}
        >
          Register
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Create an account for your {type === 'band' ? 'band' : 'venue'}.
        </Typography>

        <Divider sx={{ mb: 3, borderColor: 'divider' }} />

        <Stack spacing={2}>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            color="primary"
          >
            <ToggleButton value="band">Band</ToggleButton>
            <ToggleButton value="venue">Venue</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="City ID"
            name="city_id"
            value={form.city_id}
            onChange={handleChange}
            fullWidth
            required
          />

          {type === 'venue' && (
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              fullWidth
              required
            />
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            sx={{ fontWeight: 'bold' }}
          >
            Register
          </Button>

          <Typography variant="body2" mt={2}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>

          {error && (
            <Alert severity="error">
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
