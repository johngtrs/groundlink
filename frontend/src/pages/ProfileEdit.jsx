import { useEffect } from 'react';
import { Box, Button, Typography, Stack, Paper, Divider } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import FormField from '../components/FormField';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SelectField from '../components/SelectField';

export default function ProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const methods = useForm();
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile');
        const data = response.data;

        reset({
          name: data?.typeable?.name || '',
          profilePicture: data?.profilePicture || '',
          genres: data?.typeable?.genres?.map((g) => g.id) || [],
          spotify: data?.typeable?.spotify || '',
          website: data?.typeable?.website || '',
          address: data?.typeable?.address || '',
          city: data?.typeable?.city || '',
          capacity: data?.typeable?.capacity || '',
          description: data?.typeable?.description || '',
        });
      } catch (error) {
        console.error('Erreur lors du chargement du profil :', error);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      await api.put('/api/profile', data);
      navigate('/profile');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: 600 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}
        >
          Modifier le profil
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <FormField name="profilePicture" label="Photo de profil (URL)" />
              <FormField name="name" label="Nom" />

              {user?.type === 'band' && (
                <>
                  <SelectField
                    name="genres"
                    label="Genres musicaux"
                    endpoint="/api/genres"
                    multiple
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                  <FormField name="spotify" label="Lien Spotify" />
                  <FormField name="website" label="Site web" />
                </>
              )}

              {user?.type === 'venue' && (
                <>
                  <FormField name="address" label="Adresse" />
                  <FormField name="city" label="Ville" />
                  <FormField name="capacity" label="Capacité (nombre de personnes)" type="number" />
                  <FormField name="website" label="Site web" />
                </>
              )}

              <FormField name="description" label="Description" multiline minRows={4} />

              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button variant="outlined" onClick={() => navigate('/profile')}>
                  Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Enregistrer
                </Button>
              </Stack>
            </Stack>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
}
