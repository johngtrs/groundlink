// pages/Register.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from './context/useAuth';
import { Link } from 'react-router-dom';
import FormField from './components/FormField';

export default function Register() {
  const { register: registerUser, loading } = useAuth();
  const [error, setError] = useState(null);
  const [type, setType] = useState('band'); // 'band' or 'venue'

  const methods = useForm();

  const handleTypeChange = (_, newType) => {
    if (newType !== null) setType(newType);
  };

  const onSubmit = async (data) => {
    setError(null);

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      description: data.description,
      city_id: data.city_id,
      ...(type === 'venue' && { capacity: data.capacity }),
      type,
    };

    try {
      await registerUser(payload);
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
      <Paper
        elevation={6}
        sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1, width: '100%', maxWidth: 500 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
        >
          Register
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Create an account for your {type === 'band' ? 'band' : 'venue'}.
        </Typography>

        <Divider sx={{ mb: 3, borderColor: 'divider' }} />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
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

              <FormField name="name" label="Name" />
              <FormField name="email" label="Email" type="email" />
              <FormField name="password" label="Password" type="password" />
              <FormField name="confirmPassword" label="Confirm Password" type="password" />
              <FormField name="description" label="Description" multiline rows={3} />
              <FormField name="city_id" label="City ID" />
              {type === 'venue' && <FormField name="capacity" label="Capacity" type="number" />}

              <Button variant="contained" color="primary" type="submit" sx={{ fontWeight: 'bold' }}>
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
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
}
