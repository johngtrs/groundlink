import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function PublicRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return user ? <Navigate to="/" replace /> : <Outlet />;
}
