import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Stack, CircularProgress, Button } from '@mui/material';
import api from '../api/axios';
import ExternalLink from '../components/ExternalLink';

export default function VenueView() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/venues/${id}`)
      .then((res) => setVenue(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!venue) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, maxWidth: 600 }}>
        <Button component={Link} to="/" sx={{ mb: 2 }}>
          ← Retour à l’accueil
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {venue.name}
        </Typography>

        <Stack spacing={2} mt={2}>
          <Typography>
            <strong>Adresse :</strong> {venue.formatted_address}
          </Typography>
          <Typography>
            <strong>Capacité :</strong> {venue.capacity}
          </Typography>
          <Typography>
            <strong>Site web :</strong> <ExternalLink url={venue.website} />
          </Typography>
          <Typography>
            <strong>Description :</strong> {venue.description}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
