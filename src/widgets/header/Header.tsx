import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import { Brand } from "../brand";

export function Header() {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
    >
      <Toolbar>
        <Brand
          logoWidth={150}
          showSubtitle={false}
          showVersion={false}
        />

        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
}