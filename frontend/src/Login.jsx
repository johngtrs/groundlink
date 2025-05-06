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
} from '@mui/material';
import { useAuth } from './context/useAuth';
import { Link } from 'react-router-dom';

export default function Login() {
  const { user, login, logout, loading } = useAuth();
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    try {
      await login(credentials);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
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
              Logged in as: <strong>{user.name}</strong>
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              sx={{ fontWeight: 'bold' }}
            >
              Login
            </Button>

            <Typography variant="body2" mt={2}>
              Pas encore de compte ? <Link to="/register">Register</Link>
            </Typography>

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
