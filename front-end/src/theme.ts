import { createTheme, type PaletteMode } from '@mui/material';

export function buildTheme(mode: PaletteMode) {
  const light = mode === 'light';
  return createTheme({
    palette: {
      mode,
      primary: { main: light ? '#1976D2' : '#42A5F5', dark: light ? '#1565C0' : '#1976D2' },
      warning: { main: light ? '#E65100' : '#FFA726', light: light ? '#FFF3E0' : '#4E2000' },
      success: { main: light ? '#2E7D32' : '#66BB6A', light: light ? '#E8F5E9' : '#1B5E20' },
      background: {
        default: light ? '#F5F7FA' : '#121212',
        paper: light ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: light ? '#212121' : '#E0E0E0',
        secondary: light ? '#616161' : '#9E9E9E',
      },
      divider: light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
    },
    shape: { borderRadius: 8 },
    typography: {
      fontWeightMedium: 500,
      button: { fontWeight: 600, textTransform: 'none' },
    },
    components: {
      MuiCard: { defaultProps: { variant: 'elevation' } },
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiFab: { defaultProps: { color: 'primary' } },
    },
  });
}
