import { Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ResponsiveDataGrid from './ResponsiveDataGrid';
import { getFlagEmoji } from '../../utils/flags';

export default function BandTable({ rows, onRowDoubleClick, loading }) {
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
      headerName: '',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          component={Link}
          to={`/band/${params.row.id}`}
          size="small"
          sx={{
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          Voir le groupe
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
