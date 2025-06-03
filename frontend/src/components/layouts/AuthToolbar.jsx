import { Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function AuthToolbar() {
  const { user, logout } = useAuth();

  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      {user ? (
        <>
          <Button variant="contained" component={Link} to="/profile">
            Voir mon profil
          </Button>
          <Button variant="outlined" onClick={logout}>
            Se déconnecter
          </Button>
        </>
      ) : (
        <>
          <Button variant="contained" component={Link} to="/login">
            Se connecter
          </Button>
          <Button variant="outlined" component={Link} to="/register">
            Créer un compte
          </Button>
        </>
      )}
    </Stack>
  );
}
