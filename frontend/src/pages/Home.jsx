import { Box, Button, Typography, Stack, Paper } from '@mui/material';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 10,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}
        >
          Ground Link
        </Typography>

        {user ? (
          <Stack spacing={3} mt={3} alignItems="center">
            <Typography variant="h6">
              Bienvenue, <strong>{user.name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vous êtes connecté à votre espace Ground Link.
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={logout}
              sx={{ fontWeight: 'bold', mt: 2 }}
            >
              Se déconnecter
            </Button>
          </Stack>
        ) : (
          <Stack spacing={3} mt={3} alignItems="center">
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Connectez-vous pour accéder à votre espace personnel.
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                component={Link}
                to="/login"
                sx={{ fontWeight: 'bold', px: 4 }}
              >
                Se connecter
              </Button>

              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>

              <Button
                variant="outlined"
                component={Link}
                to="/register"
                sx={{ fontWeight: 'bold', px: 4 }}
              >
                Créer un compte
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
