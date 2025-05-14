import { Box, Button, Typography, Stack, Paper, Divider } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import FormField from '../components/FormField';
import { useNavigate } from 'react-router-dom';

export default function ProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      name: user?.name || '',
      profilePicture: user?.profilePicture || '',
      genre: user?.typeable?.genre || '',
      spotify: user?.typeable?.spotify || '',
      website: user?.typeable?.website || '',
      address: user?.typeable?.address || '',
      city: user?.typeable?.city || '',
      capacity: user?.typeable?.capacity || '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    // TODO: Envoyer les données mises à jour à l'API
    console.log('Données soumises :', data);
    navigate('/profile');
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

              {/* Champs spécifiques au type */}
              {user?.type === 'band' && (
                <>
                  <FormField name="genre" label="Genre musical" />
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
