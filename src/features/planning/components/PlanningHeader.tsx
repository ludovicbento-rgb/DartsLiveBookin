import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface PlanningHeaderProps {
    venueName: string;
    availableBoards: number;
}

export function PlanningHeader({
    venueName,
    availableBoards,
}: PlanningHeaderProps) {
    return (
        <Stack spacing={1}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                }}
            >
                {venueName}
            </Typography>

            <Typography color="text.secondary">
                {new Date().toLocaleDateString("fr-FR")}
            </Typography>

            <Typography color="success.main">
                {availableBoards} cible(s) disponible(s)
            </Typography>

            <Typography color="text.secondary">
                Sélectionnez une cible disponible.
            </Typography>
        </Stack>
    );
}