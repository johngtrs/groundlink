import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Stack, Button, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import BackToHomeButton from '../components/BackToHomeButton';
import AvatarUploader from '../components/AvatarUploader';

export default function ProfileView() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/profile');
        setProfile(data);
      } catch (error) {
        console.error('Erreur lors du chargement du profil', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  const { name, type, typeable } = profile;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, maxWidth: 600, width: '100%' }}>
        <BackToHomeButton />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Mon profil
        </Typography>

        <Stack spacing={2} mt={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <AvatarUploader avatarUrl={typeable?.avatar} />
          </Box>

          <Typography>
            <strong>Nom :</strong> {name}
          </Typography>

          {type === 'band' && (
            <>
              <Typography>
                <strong>Genres :</strong> {typeable.genres.map((genre) => genre.name).join(', ')}
              </Typography>
              <Typography>
                <strong>Spotify :</strong> {typeable?.spotify ?? ''}
              </Typography>
              <Typography>
                <strong>Site web :</strong> {typeable?.website ?? ''}
              </Typography>
            </>
          )}

          {type === 'venue' && (
            <>
              <Typography>
                <strong>Adresse :</strong> {typeable?.address ?? ''}
              </Typography>
              <Typography>
                <strong>Ville :</strong> {typeable?.city ?? ''}
              </Typography>
              <Typography>
                <strong>Capacité :</strong> {typeable?.capacity ?? ''}
              </Typography>
              <Typography>
                <strong>Site web :</strong> {typeable?.website ?? ''}
              </Typography>
            </>
          )}

          <Typography>
            <strong>Description :</strong> {typeable?.description ?? ''}
          </Typography>

          <Button
            variant="contained"
            component={Link}
            to="/profile/edit"
            sx={{ fontWeight: 'bold', mt: 2, alignSelf: 'flex-end' }}
          >
            Modifier le profil
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
