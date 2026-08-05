import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { appConfig } from "../../shared/config/app.config";

export function Footer() {
    return (
        <Box
            sx={{
                mt: 6,
                pb: 2,
                textAlign: "center",
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {appConfig.copyright}
            </Typography>
        </Box>
    );
}