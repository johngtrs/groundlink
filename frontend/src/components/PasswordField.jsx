import { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function PasswordField({
  label = 'Mot de passe',
  name,
  value,
  onChange,
  required = false,
  fullWidth = true,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label={label}
      name={name}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required={required}
      fullWidth={fullWidth}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                onClick={handleToggleVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
