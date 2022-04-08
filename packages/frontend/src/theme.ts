import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
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
    white: "#FFF5EE",
    secondary: { main: "#85FFC7" },
    primary: {
      main: "#26547C",
      light: "80A1D4",
    },
    text: {
      primary: "#2a2a2a",
    },
    warning: { main: "#902D41" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          display: "flex",
          fontWeight: "bold",
          justifyContent: "center",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "1.5rem",
          justifyContent: "center",
        },
      },
    },
  },
});
