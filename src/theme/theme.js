import { createTheme } from '@mui/material/styles';
import { pink, purple } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: pink[600], // Matching your Android App vibes
        },
        secondary: {
            main: purple[500],
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
            color: pink[700],
        },
        h4: {
            fontWeight: 600,
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Modern look
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
            },
        },
    },
});

export default theme;
