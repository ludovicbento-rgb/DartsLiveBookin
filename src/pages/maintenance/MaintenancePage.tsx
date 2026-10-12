import {
  Alert,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import BuildIcon
  from "@mui/icons-material/Build";

import {
  Navigate,
} from "react-router-dom";

import {
  AppLayout,
} from "../../app/layouts/AppLayout";

import {
  useConfiguration,
} from "@/features/configuration/hooks/useConfiguration";

const DEFAULT_MESSAGE =
  "Une maintenance est actuellement en cours. L'application sera de nouveau disponible prochainement.";

export function MaintenancePage() {

  const {
    configuration,
    loading,
    error,
  } =
    useConfiguration();

  /*
   * ============================================================
   * CHARGEMENT
   * ============================================================
   */

  if (loading) {

    return (

      <AppLayout>

        <Stack
          spacing={2}
          sx={{
            minHeight: "60vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <CircularProgress />

          <Typography
            color="text.secondary"
          >

            Chargement...

          </Typography>

        </Stack>

      </AppLayout>

    );

  }

  /*
   * ============================================================
   * ERREUR CONFIGURATION
   * ============================================================
   */

  if (
    error
    ||
    !configuration
  ) {

    return (

      <AppLayout>

        <Alert severity="error">

          Impossible de charger l'état de l'application.

        </Alert>

      </AppLayout>

    );

  }

  /*
   * ============================================================
   * MAINTENANCE TERMINEE
   * ============================================================
   *
   * Grâce au listener Firestore temps réel,
   * cette redirection est automatique lorsque
   * l'administrateur désactive la maintenance.
   */

  if (
    !configuration
      .maintenanceMode
  ) {

    return (

      <Navigate
        to="/dashboard"
        replace
      />

    );

  }

  /*
   * ============================================================
   * MAINTENANCE ACTIVE
   * ============================================================
   */

  return (

    <AppLayout>

      <Stack
        spacing={3}
        sx={{
          maxWidth: 700,
          mx: "auto",
          py: 6,
          textAlign: "center",
          alignItems: "center",
        }}
      >

        <BuildIcon
          color="warning"
          sx={{
            fontSize: 72,
          }}
        />

        <Stack spacing={1}>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >

            Maintenance en cours

          </Typography>

          <Typography
            color="text.secondary"
          >

            {
              configuration
                .applicationName
            }

          </Typography>

        </Stack>

        <Alert
          severity="warning"
          sx={{
            width: "100%",
            textAlign: "left",
          }}
        >

          {
            configuration
              .maintenanceMessage
            ??
            DEFAULT_MESSAGE
          }

        </Alert>

        <Typography
          variant="body2"
          color="text.secondary"
        >

          Vous pouvez laisser cette page ouverte.
          L'application sera de nouveau accessible
          automatiquement lorsque la maintenance sera terminée.

        </Typography>

      </Stack>

    </AppLayout>

  );

}

export default MaintenancePage; 