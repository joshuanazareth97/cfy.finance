import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
	interface Palette {
		white: string;
	}

	// allow configuration using `createTheme`
	interface PaletteOptions {
		white?: string;
	}
}

export const theme = createTheme({
	palette: {
		white: '#FFF5EE',
		secondary: { main: '#8F2D56' },
		primary: {
			main: '#2C6E49',
			light: '4C956C',
		},
		text: {
			primary: '#2a2a2a',
		},
		warning: { main: '#902D41' },
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					fontWeight: 'bold',
				},
			},
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: {
					display: 'flex',
					fontWeight: 'bold',
					justifyContent: 'center',
				},
			},
		},
		MuiDialogActions: {
			styleOverrides: {
				root: {
					padding: '1.5rem',
					justifyContent: 'center',
				},
			},
		},
	},
});
