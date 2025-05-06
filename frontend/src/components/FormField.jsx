import React from 'react';
import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

export default function FormField({ name, label, type = 'text', multiline = false, rows }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          multiline={multiline}
          rows={rows}
          error={!!error}
          helperText={error?.message}
          fullWidth
          required
        />
      )}
    />
  );
}
