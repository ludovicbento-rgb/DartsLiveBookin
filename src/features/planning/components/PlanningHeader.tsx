import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type {
    VenuePlanning,
} from "../model/planning.types";

interface PlanningHeaderProps {
    planning: VenuePlanning;
}

export function PlanningHeader({
    planning,
}: PlanningHeaderProps) {
    const availableBoards =

        planning.slots

            .flatMap(

                slot => slot.boards,

            )

            .filter(

                board =>

                    board.status === "AVAILABLE",

            )

            .length;
    return (
        <Stack spacing={1}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                }}
            >
                {planning.venueName}
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