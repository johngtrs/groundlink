import { useEffect, useState } from 'react';
import { Box, Grid, Paper, TextField, Typography, Autocomplete, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PropTypes from 'prop-types';
import { debounce } from '@mui/material/utils';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function loadGoogleScript(callbackName) {
  if (document.querySelector(`script[src*="maps.googleapis.com"]`)) return;

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async&libraries=places&callback=${callbackName}`;
  script.async = true;
  script.defer = true;
  script.setAttribute('data-loaded', 'true');
  document.head.appendChild(script);
}

function CustomPaper({ children, ...props }) {
  const theme = useTheme();

  return (
    <Paper {...props}>
      {children}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <img
          src={
            theme.palette.mode === 'dark'
              ? 'https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white3_hdpi.png'
              : 'https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png'
          }
          alt="Powered by Google"
          width="120"
          height="14"
        />
      </Box>
    </Paper>
  );
}

function highlightMatch(text, matches) {
  if (!matches?.length) return [{ text, highlight: false }];

  const result = [];
  let lastIndex = 0;

  matches.forEach((match) => {
    if (match.offset > lastIndex) {
      result.push({ text: text.slice(lastIndex, match.offset), highlight: false });
    }
    result.push({
      text: text.slice(match.offset, match.offset + match.length),
      highlight: true,
    });
    lastIndex = match.offset + match.length;
  });

  if (lastIndex < text.length) {
    result.push({ text: text.slice(lastIndex), highlight: false });
  }

  return result;
}

CustomPaper.propTypes = {
  children: PropTypes.node,
};

const fetchSuggestions = debounce((input, sessionToken, types, callback) => {
  const service = new window.google.maps.places.AutocompleteService();

  service.getPlacePredictions(
    {
      input,
      sessionToken,
      types,
    },
    callback
  );
}, 400);

export default function GooglePlacesAutocomplete({ label, value, onChange, limit = 'full' }) {
  const [inputValue, setInputValue] = useState(value?.formatted_address || '');
  const [options, setOptions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!window.google && !document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      window.initMap = () => setLoaded(true);
      loadGoogleScript('initMap');
    } else if (window.google) {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || inputValue === '') {
      setOptions([]);
      return;
    }

    const sessionToken = new window.google.maps.places.AutocompleteSessionToken();
    const types = limit === 'city' ? ['postal_code', 'locality'] : [];

    fetchSuggestions(inputValue, sessionToken, types, (predictions, status) => {
      if (
        status !== window.google.maps.places.PlacesServiceStatus.OK ||
        !Array.isArray(predictions)
      ) {
        setOptions([]);
        return;
      }

      const mapped = predictions.map((prediction) => ({
        description: prediction.description,
        structured_formatting: prediction.structured_formatting,
        place_id: prediction.place_id,
      }));

      setOptions(mapped);
    });
  }, [inputValue, loaded, limit]);

  return (
    <Autocomplete
      fullWidth
      autoComplete
      includeInputInList
      filterSelectedOptions
      filterOptions={(x) => x}
      options={options}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.formatted_address || option.description || ''
      }
      isOptionEqualToValue={(option, value) =>
        option?.place_id && value?.place_id
          ? option.place_id === value.place_id
          : option?.formatted_address === value?.formatted_address
      }
      value={value?.formatted_address ? value : null}
      inputValue={inputValue}
      onInputChange={(e, newInputValue, reason) => {
        if (reason === 'input') {
          setInputValue(newInputValue);
          if (newInputValue === '') onChange(null);
        }
      }}
      onChange={(e, newValue) => {
        if (!newValue?.place_id) {
          onChange(null);
          setInputValue('');
          return;
        }

        const service = new window.google.maps.places.PlacesService(document.createElement('div'));

        service.getDetails(
          {
            placeId: newValue.place_id,
            fields: ['address_components', 'geometry', 'formatted_address'],
          },
          (place, status) => {
            if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) return;

            const get = (type, useShortName = false) => {
              const component = place.address_components.find((c) => c.types.includes(type));
              return useShortName ? component?.short_name || '' : component?.long_name || '';
            };

            const parsed = {
              formatted_address: place.formatted_address,
              street_number: get('street_number'),
              route: get('route'),
              city: get('locality'),
              postal_code: get('postal_code'),
              country: get('country'),
              country_code: get('country', true),
              region: get('administrative_area_level_1'),
              department: get('administrative_area_level_2'),
              lat: place.geometry?.location?.lat() ?? null,
              lng: place.geometry?.location?.lng() ?? null,
              place_id: newValue.place_id,
            };

            setInputValue(place.formatted_address);
            onChange(parsed);
          }
        );
      }}
      noOptionsText="Aucun lieu trouvé"
      slotProps={{ paper: { component: CustomPaper } }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText="📍 Veuillez sélectionner le résultat dans la liste pour le valider."
          fullWidth
        />
      )}
      renderOption={(props, option) => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = highlightMatch(option.structured_formatting.main_text, matches);
        const { key, ...rest } = props;

        return (
          <li key={key} {...rest}>
            <Grid container sx={{ alignItems: 'center' }}>
              <Grid sx={{ display: 'flex', width: 44 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? 'fontWeightBold' : 'fontWeightRegular' }}
                  >
                    {part.text}
                  </Box>
                ))}
                {option.structured_formatting.secondary_text && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {option.structured_formatting.secondary_text}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
