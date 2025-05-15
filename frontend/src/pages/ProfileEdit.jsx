import { useEffect, useState } from 'react';
import { Box, Button, Typography, Stack, Paper, Divider, CircularProgress } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import FormField from '../components/FormField';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SelectSearchField from '../components/SelectSearchField';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema } from '../validations/profileSchema';

export default function ProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const methods = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      profilePicture: '',
      genres: [],
      spotify: '',
      website: '',
      address: '',
      city: '',
      capacity: null,
      description: '',
    },
  });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile');
        const data = response.data;

        reset({
          name: data?.typeable?.name ?? '',
          profilePicture: data?.profilePicture ?? '',
          genres: data?.typeable?.genres?.map((g) => g.id) ?? [],
          spotify: data?.typeable?.spotify ?? '',
          website: data?.typeable?.website ?? '',
          address: data?.typeable?.address ?? '',
          city: data?.typeable?.city ?? '',
          capacity: data?.typeable?.capacity ?? null,
          description: data?.typeable?.description ?? '',
        });
      } catch (error) {
        console.error('Erreur lors du chargement du profil :', error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

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
                  <SelectSearchField
                    name="genres"
                    label="Genres musicaux"
                    endpoint="/api/genres"
                    multiple
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    disableCloseOnSelect
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
