import React, { useState } from 'react';
import api from './api/axios';
import { Box, Button, Typography, Alert, Stack, TextField, Paper, Divider } from '@mui/material';

export default function TestSanctumLogin() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const login = async () => {
    try {
      // Get the CSRF token cookie required by Laravel Sanctum
      await api.get('/sanctum/csrf-cookie');

      // Send login credentials to the backend
      await api.post('/login', credentials);

      // Fetch the authenticated user's data
      const res = await api.get('/api/user');
      setUser(res.data);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
        >
          Ground Link
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Login with your band or venue account to access your dashboard.
        </Typography>

        <Divider sx={{ mb: 3, borderColor: 'divider' }} />

        {user ? (
          <Stack spacing={2}>
            <Typography>
              Logged in as: <strong>{user.email}</strong>
            </Typography>
            <Button variant="contained" color="error" onClick={logout} sx={{ fontWeight: 'bold' }}>
              Logout
            </Button>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button variant="contained" color="primary" onClick={login} sx={{ fontWeight: 'bold' }}>
              Login
            </Button>
            {error && (
              <Alert severity="error">
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </Alert>
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
