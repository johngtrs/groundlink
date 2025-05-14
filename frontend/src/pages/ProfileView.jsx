import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api/axios';

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

  const { name, profilePicture, type, typeable } = profile;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, maxWidth: 600, width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Mon profil
        </Typography>

        <Stack spacing={2} mt={2}>
          <img
            src={
              profilePicture ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-A5eHDWdwLOz3nCkfocCkaqRNCXVHXOzV-A&s'
            }
            alt="Photo de profil"
            style={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              objectFit: 'cover',
              alignSelf: 'center',
            }}
          />

          <Typography>
            <strong>Nom :</strong> {name}
          </Typography>

          {type === 'band' && (
            <>
              <Typography>
                <strong>Genre :</strong> {typeable?.genre ?? ''}
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
