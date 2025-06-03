import { Box, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';

export default function ResponsiveDataGrid({
  rows,
  columns,
  onRowDoubleClick,
  hiddenColumns = [],
  loading = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columnVisibilityModel = hiddenColumns.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {});

  return (
    <Box sx={{ overflowX: isMobile ? 'auto' : 'visible' }}>
      <Box
        sx={{
          minWidth: isMobile ? 1000 : '100%',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: 300,
        }}
      >
        <DataGrid
          showToolbar
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          getRowHeight={() => 'auto'}
          disableRowSelectionOnClick
          loading={loading}
          density={isMobile ? 'compact' : 'comfortable'}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
            filter: { filterModel: { items: [], quickFilterExcludeHiddenColumns: false } },
          }}
          columnVisibilityModel={columnVisibilityModel}
          onRowDoubleClick={onRowDoubleClick}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            width: '100%',
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
        />
      </Box>
    </Box>
  );
}
