import { useEffect, useState, useLayoutEffect } from 'react';
import { Box, Grid, Paper, TextField, Typography, Autocomplete, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PropTypes from 'prop-types';
import { debounce } from '@mui/material/utils';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBXyFCMvedY7fKxjckgDldytLg2KHe9I_w';

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

const fetchSuggestions = debounce((input, sessionToken, callback) => {
  const service = new window.google.maps.places.AutocompleteService();
  service.getPlacePredictions({ input, sessionToken }, callback);
}, 400);

export default function GooglePlacesAutocomplete({ label, value, onChange }) {
  const [inputValue, setInputValue] = useState('');
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

  useLayoutEffect(() => {
    if (!loaded) return;
    const sessionToken = new window.google.maps.places.AutocompleteSessionToken();

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return;
    }

    fetchSuggestions(inputValue, sessionToken, (predictions = []) => {
      const mapped = predictions.map((prediction) => ({
        description: prediction.description,
        structured_formatting: prediction.structured_formatting,
      }));
      setOptions(mapped);
    });
  }, [inputValue, value, loaded]);

  return (
    <Autocomplete
      fullWidth
      autoComplete
      includeInputInList
      filterSelectedOptions
      filterOptions={(x) => x}
      options={options}
      getOptionLabel={(option) => option.description || ''}
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
      noOptionsText="Aucun lieu trouvé"
      slotProps={{ paper: { component: CustomPaper } }}
      renderInput={(params) => <TextField {...params} label={label} fullWidth />}
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
                    sx={{
                      fontWeight: part.highlight ? 'fontWeightBold' : 'fontWeightRegular',
                    }}
                  >
                    {part.text}
                  </Box>
                ))}
                {option.structured_formatting.secondary_text ? (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {option.structured_formatting.secondary_text}
                  </Typography>
                ) : null}
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
