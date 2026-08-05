import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Logo } from "../logo";
import { appConfig } from "../../shared/config/app.config";

export interface BrandProps {
  logoWidth?: number | string;
  showSubtitle?: boolean;
  showVersion?: boolean;
}

export function Brand({
  logoWidth = 260,
  showSubtitle = true,
  showVersion = true,
}: BrandProps) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      textAlign="center"
    >
      <Logo width={logoWidth} />

      {showSubtitle && (
        <Typography
          variant="h6"
          color="text.secondary"
        >
          {appConfig.championshipName}
        </Typography>
      )}

      {showVersion && (
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Version {appConfig.version}
        </Typography>
      )}
    </Stack>
  );
}