import Typography from "@mui/material/Typography";

import { AppLayout } from "../../app/layouts/AppLayout";

export function NotFoundPage() {
  return (
    <AppLayout>
      <Typography variant="h3">
        404
      </Typography>

      <Typography>
        La page demandée est introuvable.
      </Typography>
    </AppLayout>
  );
}