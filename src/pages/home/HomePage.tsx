import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";
import {
  LOGIN_ROUTE,
  ACTIVATE_ACCOUNT_ROUTE,
} from "@/shared/routing";

import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard, AppButton, PageTitle } from "@/shared/ui";

export function HomePage() {

  const navigate = useNavigate();

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

          <AppButton
            onClick={() => navigate(LOGIN_ROUTE)}
          >
            Se connecter
          </AppButton>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(ACTIVATE_ACCOUNT_ROUTE)}
          >
            Activer mon compte
          </Button>

        </Stack>
      </AppCard>
    </AppLayout>
  );
}

export default HomePage;