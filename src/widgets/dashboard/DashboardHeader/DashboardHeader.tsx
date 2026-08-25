import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface DashboardHeaderProps {
    firstname: string;
    season: string;
}

export function DashboardHeader({
    firstname,
    season,
}: DashboardHeaderProps) {
    return (
        <Stack spacing={1}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                }}
            >
                Bonjour {firstname} 👋
            </Typography>

            <Typography color="text.secondary">
                Championnat de France Dartslive
            </Typography>

            <Typography
                variant="caption"
                color="text.secondary"
            >
                Saison {season}
            </Typography>
        </Stack>
    );
}