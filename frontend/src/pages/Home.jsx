import { Box, Button, Typography, Stack, Paper } from '@mui/material';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Home() {
  const { user, logout, initialLoading } = useAuth();
  const [bands, setBands] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const bandColumns = [
    { field: 'name', headerName: 'Nom', flex: 1 },
    {
      field: 'genres',
      headerName: 'Genres',
      flex: 2,
      renderCell: (params) => params.row?.genres?.map((g) => g.name).join(', ') ?? '',
    },
    { field: 'postal_code', headerName: 'Code Postal', flex: 1 },
    { field: 'city', headerName: 'Ville', flex: 1 },
    { field: 'department', headerName: 'Département', flex: 1 },
    { field: 'region', headerName: 'Région', flex: 1 },
    { field: 'country', headerName: 'Pays', flex: 1 },
    {
      field: 'action',
      flex: 1,
      headerName: '',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button variant="outlined" component={Link} to={`/band/${params.row.id}`} size="small">
          Voir le groupe
        </Button>
      ),
    },
  ];

  const venueColumns = [
    { field: 'name', headerName: 'Nom', flex: 2 },
    { field: 'capacity', headerName: 'Capacité', flex: 1 },
    { field: 'postal_code', headerName: 'Code Postal', flex: 2 },
    { field: 'city', headerName: 'Ville', flex: 2 },
    { field: 'department', headerName: 'Département', flex: 2 },
    { field: 'region', headerName: 'Région', flex: 2 },
    { field: 'country', headerName: 'Pays', flex: 2 },
    {
      field: 'action',
      flex: 1,
      headerName: '',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button variant="outlined" component={Link} to={`/band/${params.row.id}`} size="small">
          Voir la Salle
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
        Ground Link
      </Typography>

      <Box textAlign="center" mb={4}>
        {user ? (
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" component={Link} to="/profile">
              Voir mon profil
            </Button>
            <Button variant="outlined" onClick={logout}>
              Se déconnecter
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" component={Link} to="/login">
              Se connecter
            </Button>
            <Button variant="outlined" component={Link} to="/register">
              Créer un compte
            </Button>
          </Stack>
        )}
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Groupes
        </Typography>
        <DataGrid
          rows={bands}
          columns={bandColumns}
          loading={loading}
          showToolbar
          density="comfortable"
          columnVisibilityModel={{
            country: false,
          }}
          getRowId={(row) => row.id}
          getRowHeight={() => 'auto'}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
            filter: {
              filterModel: {
                items: [],
                quickFilterExcludeHiddenColumns: false,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            width: '100%',
            minHeight: 300,
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: 1.4,
              paddingTop: '8px',
              paddingBottom: '8px',
              fontSize: '0.9rem',
            },
            '& .MuiDataGrid-columnHeaders': {
              fontSize: '0.95rem',
              fontWeight: 600,
              paddingY: '6px',
            },
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'hidden !important',
            },
            '& .MuiDataGrid-window': {
              overflow: 'hidden !important',
            },
          }}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Salles de concert
        </Typography>
        <DataGrid
          rows={venues}
          columns={venueColumns}
          loading={loading}
          showToolbar
          density="comfortable"
          getRowId={(row) => row.id}
          getRowHeight={() => 'auto'}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            width: '100%',
            minHeight: 300,
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: 1.4,
              paddingTop: '8px',
              paddingBottom: '8px',
              fontSize: '0.9rem',
            },
            '& .MuiDataGrid-columnHeaders': {
              fontSize: '0.95rem',
              fontWeight: 600,
              paddingY: '6px',
            },
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'hidden !important',
            },
            '& .MuiDataGrid-window': {
              overflow: 'hidden !important',
            },
          }}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Paper>
    </Box>
  );
}
