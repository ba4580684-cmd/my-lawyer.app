import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import './styles.css';
const theme=createTheme({palette:{mode:'light',primary:{main:'#163a5b'},secondary:{main:'#b58a4b'},background:{default:'#f4f6f9',paper:'#ffffff'}},typography:{fontFamily:'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',button:{textTransform:'none',fontWeight:600}},shape:{borderRadius:12},components:{MuiButton:{styleOverrides:{root:{borderRadius:10,paddingInline:16}}},MuiPaper:{styleOverrides:{root:{backgroundImage:'none'}}}}});
const qc=new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={qc}><ThemeProvider theme={theme}><CssBaseline/><App/></ThemeProvider></QueryClientProvider></React.StrictMode>);
