import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';
import AuthToolbar from '../components/layouts/AuthToolbar';
import BandTable from '../components/datagrid/BandTable';
import VenueTable from '../components/datagrid/VenueTable';

export default function Home() {
  const { initialLoading } = useAuth();
  const [bands, setBands] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bandsRes, venuesRes] = await Promise.all([
          api.get('/api/bands'),
          api.get('/api/venues'),
        ]);
        setBands(bandsRes.data);
        setVenues(venuesRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (initialLoading) return null;

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
        Ground Link
      </Typography>

      <Box textAlign="center" mb={4}>
        <AuthToolbar />
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Groupes
        </Typography>
        <BandTable
          rows={bands}
          loading={loading}
          onRowDoubleClick={(params) => navigate(`/band/${params.row.id}`)}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Salles de concert
        </Typography>
        <VenueTable
          rows={venues}
          loading={loading}
          onRowDoubleClick={(params) => navigate(`/venue/${params.row.id}`)}
        />
      </Paper>
    </Box>
  );
}
