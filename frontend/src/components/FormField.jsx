import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Controller, useFormContext } from 'react-hook-form';

export default function FormField({ name, label, type = 'text', ...rest }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          type={isPassword && showPassword ? 'text' : type}
          label={label}
          variant="outlined"
          fullWidth
          error={Boolean(errors[name])}
          helperText={errors[name]?.message}
          slotProps={{
            input: {
              endAdornment: isPassword && (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...rest}
        />
      )}
    />
  );
}
