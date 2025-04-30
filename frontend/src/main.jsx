import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './theme.js';
import AuthProvider from './context/AuthProvider';
import TestSanctumLogin from './TestSanctumLogin.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        {/* <App /> */}
        <TestSanctumLogin />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
