import { useEffect, useState } from 'react';
import { Box, Button, Typography, Stack, Paper, Divider, CircularProgress } from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import FormField from '../components/FormField';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SelectSearchField from '../components/SelectSearchField';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema } from '../validations/profileSchema';
import GooglePlacesAutocomplete from '../components/GooglePlacesAutocomplete';

export default function ProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const methods = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      genres: [],
      spotify: '',
      website: '',
      address: {
        formatted_address: '',
        address: '',
        postal_code: '',
        city: '',
        country: '',
        country_code: '',
        region: '',
        department: '',
        lat: null,
        lng: null,
        place_id: '',
      },
      capacity: '',
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
          genres: data?.typeable?.genres?.map((g) => g.id) ?? [],
          spotify: data?.typeable?.spotify ?? '',
          website: data?.typeable?.website ?? '',
          address: {
            formatted_address: data?.typeable?.formatted_address ?? '',
            address: data?.typeable?.address ?? '',
            city: data?.typeable?.city ?? '',
            postal_code: data?.typeable?.postal_code ?? '',
            country: data?.typeable?.country ?? '',
            country_code: data?.typeable?.country_code ?? '',
            region: data?.typeable?.region ?? '',
            department: data?.typeable?.department ?? '',
            lat: data?.typeable?.lat ?? null,
            lng: data?.typeable?.lng ?? null,
            place_id: data?.typeable?.place_id ?? '',
          },
          capacity: data?.typeable?.capacity ?? '',
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
      const { address, ...rest } = data;
      const hasGoogleParts = address?.street_number || address?.route;

      const payload = {
        ...rest,
        formatted_address: address?.formatted_address ?? null,
        address: hasGoogleParts
          ? `${address.street_number ?? ''} ${address.route ?? ''}`.trim()
          : (address?.address ?? null),
        city: address?.city ?? null,
        postal_code: address?.postal_code ?? null,
        country: address?.country ?? null,
        country_code: address?.country_code ?? null,
        region: address?.region ?? null,
        department: address?.department ?? null,
        lat: address?.lat ?? null,
        lng: address?.lng ?? null,
        place_id: address?.place_id ?? null,
      };

      await api.put('/api/profile', payload);
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
              <FormField name="name" label="Nom" />
              <Controller
                name="address"
                control={methods.control}
                render={({ field }) => (
                  <GooglePlacesAutocomplete
                    label={user?.type === 'band' ? 'Ville' : 'Adresse'}
                    value={field.value}
                    onChange={field.onChange}
                    limit={user?.type === 'band' ? 'city' : 'full'}
                  />
                )}
              />

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
                </>
              )}

              {user?.type === 'venue' && (
                <>
                  <FormField name="capacity" label="Capacité (nombre de personnes)" type="number" />
                </>
              )}

              <FormField name="website" label="Site web" />
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
