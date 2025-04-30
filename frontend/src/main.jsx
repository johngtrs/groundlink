import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import TestSanctumLogin from './TestSanctumLogin.jsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './theme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* <App /> */}
      <TestSanctumLogin />
    </ThemeProvider>
  </StrictMode>
);
