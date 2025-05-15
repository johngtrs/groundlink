import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
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
        <FormControl fullWidth error={Boolean(errors[name])}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            value={multiple ? field.value || [] : field.value || ''}
            multiple={multiple}
            input={<OutlinedInput label={label} />}
            onChange={(e) => field.onChange(e.target.value)}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: 'auto',
                },
              },
            }}
            renderValue={(selected) =>
              multiple ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selected.map((value) => {
                    const selectedOption = options.find(
                      (option) => getOptionValue(option) === value
                    );
                    if (!selectedOption) return null;
                    return (
                      <Chip
                        key={value}
                        label={getOptionLabel(selectedOption)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onDelete={() => {
                          const newValue = field.value.filter((v) => v !== value);
                          field.onChange(newValue);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                getOptionLabel(options.find((option) => getOptionValue(option) === selected) || {})
              )
            }
            {...rest}
          >
            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={24} />
              </MenuItem>
            ) : (
              options.map((option) => (
                <MenuItem key={getOptionValue(option)} value={getOptionValue(option)}>
                  {getOptionLabel(option)}
                </MenuItem>
              ))
            )}
          </Select>
          {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
