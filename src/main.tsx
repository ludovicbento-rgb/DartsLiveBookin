import "@fontsource/roboto";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import App from "./App";

import { theme } from "./shared/theme";
import { AuthProvider } from "./features/authentication/providers/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AuthProvider>
        <App />
      </AuthProvider>

    </ThemeProvider>
  </StrictMode>,
);