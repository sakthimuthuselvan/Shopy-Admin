import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import store from './Redux/Store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: "#2A2559", // Customize your primary color
    },
    secondary: {
      main: '#19857b', // Customize your secondary color
    },
    error: {
      main: '#ff1744', // Customize your error color
    },
    background: {
      default: '#f5f5f5', // Customize your background color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Customize your font family
    h6:{
      fontWeight: "bold"
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </>
);

