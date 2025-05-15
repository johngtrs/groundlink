import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import api from '../api/axios';

export default function SelectField({
  name,
  label,
  endpoint,
  multiple = false,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.value,
  ...rest
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await api.get(endpoint);
        setOptions(response.data);
      } catch (error) {
        console.error('Failed to fetch options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          multiple={multiple}
          options={options}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={(option, value) => getOptionValue(option) === getOptionValue(value)}
          loading={loading}
          onChange={(_, data) => {
            const value = multiple
              ? data.map((item) => getOptionValue(item))
              : getOptionValue(data);
            field.onChange(value);
          }}
          value={
            multiple
              ? options.filter((opt) => (field.value || []).includes(getOptionValue(opt)))
              : options.find((opt) => getOptionValue(opt) === field.value) || null
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={Boolean(errors[name])}
              helperText={errors[name]?.message}
            />
          )}
          {...rest}
        />
      )}
    />
  );
}
