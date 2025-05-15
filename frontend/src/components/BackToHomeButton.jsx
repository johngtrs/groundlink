import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function BackToHomeButton() {
  return (
    <Button
      component={Link}
      to="/"
      variant="text"
      sx={{
        mb: 2,
        textTransform: 'none',
        alignSelf: 'flex-start',
      }}
    >
      ← Retour à l’accueil
    </Button>
  );
}
