import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";

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
            onClick={() => navigate("/login")}
          >
            Se connecter
          </AppButton>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/activate")}
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