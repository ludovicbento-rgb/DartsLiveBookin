import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { Logo } from "../logo";
import { appConfig } from "../../shared/config/app.config";

export function Header() {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
    >
      <Toolbar>

        <Logo
          width={160}
          clickable
        />

        <Box sx={{ flexGrow: 1 }} />

        <Typography
          variant="caption"
          color="text.secondary"
        >
          v{appConfig.version}
        </Typography>

      </Toolbar>
    </AppBar>
  );
}