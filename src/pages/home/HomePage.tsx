import Typography from "@mui/material/Typography";

import { AppLayout } from "../../app/layouts/AppLayout";
import { Brand } from "../../widgets/brand";

export function HomePage() {
  return (
    <AppLayout>
      <Brand />

      <Typography
        variant="h5"
        sx={{ mt: 4 }}
      >
        Bienvenue sur DartsLive Bookin
      </Typography>
    </AppLayout>
  );
}