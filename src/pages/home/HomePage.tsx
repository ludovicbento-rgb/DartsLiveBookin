import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard, AppButton, PageTitle } from "@/shared/ui";

export function HomePage() {
  return (
    <AppLayout>
      <AppCard>
        <Stack spacing={4}>
          <Stack
            spacing={1}
            sx={{
              textAlign: "center",
            }}
          >
            <PageTitle>
              Bienvenue 👋
            </PageTitle>

            <Typography color="text.secondary">
              Application officielle de réservation
            </Typography>

            <Typography color="text.secondary">
              Championnat de France Dartslive
            </Typography>
          </Stack>

          <AppButton>
            Se connecter
          </AppButton>

          <Button
            variant="outlined"
            size="large"
            fullWidth
          >
            Activer mon compte
          </Button>

          <Button
            variant="text"
            size="large"
            fullWidth
          >
            Consulter le planning
          </Button>
        </Stack>
      </AppCard>
    </AppLayout>
  );
}

export default HomePage;