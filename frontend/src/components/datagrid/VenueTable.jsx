import { Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ResponsiveDataGrid from './ResponsiveDataGrid';
import { getFlagEmoji } from '../../utils/flags';

export default function VenueTable({ rows, onRowDoubleClick, loading }) {
  const columns = [
    {
      field: 'name',
      headerName: 'Nom',
      flex: 2,
      renderCell: (params) => {
        const flag = getFlagEmoji(params.row.country_code);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>{flag}</Typography>
            <Typography>{params.row.name}</Typography>
          </Box>
        );
      },
    },
    { field: 'capacity', headerName: 'Capacité', flex: 1 },
    { field: 'postal_code', headerName: 'Code Postal', flex: 1 },
    { field: 'city', headerName: 'Ville', flex: 2 },
    { field: 'department', headerName: 'Département', flex: 2 },
    { field: 'region', headerName: 'Région', flex: 2 },
    { field: 'country', headerName: 'Pays', flex: 2 },
    {
      field: 'action',
      headerName: '',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          component={Link}
          to={`/venue/${params.row.id}`}
          size="small"
          sx={{
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          Voir la Salle
        </Button>
      ),
    },
  ];

  return (
    <ResponsiveDataGrid
      rows={rows}
      columns={columns}
      onRowDoubleClick={onRowDoubleClick}
      hiddenColumns={['country']}
      loading={loading}
    />
  );
}
