import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Stack, CircularProgress, Button } from '@mui/material';
import api from '../api/axios';
import ExternalLink from '../components/ExternalLink';

export default function BandView() {
  const { id } = useParams();
  const [band, setBand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/bands/${id}`)
      .then((res) => setBand(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!band) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, maxWidth: 600 }}>
        <Button component={Link} to="/" sx={{ mb: 2 }}>
          ← Retour à l’accueil
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {band.name}
        </Typography>

        <Stack spacing={2} mt={2}>
          <Typography>
            <strong>Adresse :</strong> {band.formatted_address}
          </Typography>
          <Typography>
            <strong>Genres :</strong> {band.genres.map((g) => g.name).join(', ')}
          </Typography>
          <Typography>
            <strong>Spotify :</strong> <ExternalLink url={band.spotify} />
          </Typography>
          <Typography>
            <strong>Site web :</strong> <ExternalLink url={band.website} />
          </Typography>
          <Typography>
            <strong>Description :</strong> {band.description}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
