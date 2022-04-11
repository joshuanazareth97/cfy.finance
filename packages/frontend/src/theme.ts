import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
	interface Palette {
		white: string;
		black: string;
		gray: string;
	}

	// allow configuration using `createTheme`
	interface PaletteOptions {
		white?: string;
		black?: string;
		gray?: string;
	}
}

const theme = createTheme({
	palette: {
		white: '#FFF5EE',
		black: '#4a4a4a',
		gray: '#6a6a6a',
		secondary: { main: '#8F2D56' },
		primary: {
			main: '#2C6E49',
			light: '#4C956C',
		},
		text: {
			primary: '#4a4a4a',
		},
		warning: { main: '#902D41' },
	},
});

theme.components = {
	...theme.components,
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
};

export { theme };
