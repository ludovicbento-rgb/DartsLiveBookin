import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.secondary
    },
    success: {
      main: colors.success
    },
    warning: {
      main: colors.warning
    },
    error: {
      main: colors.error
    },
    background: {
      default: colors.background
    }
  },

  shape: {
    borderRadius: 10
  },

  typography: {
    fontFamily: "Roboto, sans-serif",

    h4: {
      fontWeight: 700
    },

    h5: {
      fontWeight: 600
    },

    button: {
      textTransform: "none"
    }
  }
});