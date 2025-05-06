import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Stack,
  Paper,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import FormField from './components/FormField';
import api from './api/axios';
import { useAuth } from './context/useAuth';

export default function Register() {
  const [error, setError] = useState(null);
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      type: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    control,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    setError(null);

    if (!data.type) {
      setFormError('type', { type: 'manual', message: 'Veuillez sélectionner un type.' });
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      type: data.type,
    };

    try {
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('api/register', payload);
      console.log('Register Success: ', response.data);

      await fetchUser();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "L'inscription a échoué");
    }
  };

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
          Inscription
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Créez un compte pour votre groupe ou salle de concerts.
        </Typography>

        <Divider sx={{ mb: 3, borderColor: 'divider' }} />

        <FormProvider {...methods}>
          <Stack spacing={2}>
            <FormControl component="fieldset" error={Boolean(errors.type)}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                En tant que quoi vous inscrivez-vous ?
              </Typography>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="band" control={<Radio />} label="Groupe" />
                    <FormControlLabel value="venue" control={<Radio />} label="Salle de concerts" />
                  </RadioGroup>
                )}
              />
              {errors.type && (
                <Typography color="error" variant="caption">
                  {errors.type.message}
                </Typography>
              )}
            </FormControl>

            <FormField name="name" label="Nom" />
            <FormField name="email" label="Adresse e-mail" type="email" />
            <FormField name="password" label="Mot de passe" type="password" />
            <FormField name="confirmPassword" label="Confirmer le mot de passe" type="password" />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              sx={{ fontWeight: 'bold' }}
            >
              S'inscrire
            </Button>

            <Typography variant="body2" mt={2}>
              Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
            </Typography>

            {error && (
              <Alert severity="error">
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </Alert>
            )}
          </Stack>
        </FormProvider>
      </Paper>
    </Box>
  );
}
