import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import { AppLayout } from "../../app/layouts/AppLayout";

export function MaintenancePage() {
  return (
    <AppLayout>
      <Typography variant="h4" gutterBottom>
        Maintenance
      </Typography>

      <Alert severity="warning">
        L'application est momentanément indisponible.
      </Alert>
    </AppLayout>
  );
}