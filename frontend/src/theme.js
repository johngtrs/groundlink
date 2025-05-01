// MUI 6 custom theme for Metal App
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D32F2F', // blood red
    },
    secondary: {
      main: '#9A0007', // dark red
    },
    background: {
      default: '#14171a', // main background
      paper: '#181b1f', // surfaces (cards, modals, etc.)
    },
    text: {
      primary: '#FFFFFF', // main text
      secondary: '#CCCCCC', // secondary text
    },
    success: {
      main: '#388E3C',
    },
    error: {
      main: '#F44336',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: ['"Inter"', '"Roboto"', 'sans-serif'].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // remove gradient
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #1e1e1e inset !important',
            WebkitTextFillColor: '#fff !important',
            caretColor: '#fff',
            transition: 'background-color 5000s ease-in-out 0s !important',
          },
        },
      },
    },
  },
});

export default theme;
