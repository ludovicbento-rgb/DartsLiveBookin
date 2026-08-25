import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AppButton } from "@/shared/ui";

interface VenueCardProps {
    name: string;
    boardCount: number;
    availableSlots: number;
    onPlanning: () => void;
}

export function VenueCard({
    name,
    boardCount,
    availableSlots,
    onPlanning,
}: VenueCardProps) {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6">
                        {name}
                    </Typography>

                    <Typography color="text.secondary">
                        {boardCount} cible(s)
                    </Typography>

                    <Typography color="success.main">
                        {availableSlots} créneaux disponibles
                    </Typography>

                    <AppButton onClick={onPlanning}>
                        Voir le planning
                    </AppButton>
                </Stack>
            </CardContent>
        </Card>
    );
}