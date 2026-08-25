import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import RoomIcon from "@mui/icons-material/Room";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

interface VenueCardProps {
    name: string;
    city: string;
    logo: string;
    boardCount: number;
    availableSlots: number;
    onPlanning: () => void;
}

export function VenueCard({
    name,
    city,
    logo,
    boardCount,
    availableSlots,
    onPlanning,
}: VenueCardProps) {
    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            <CardContent>
                <img
                    src={`/images/venues/${logo}`}
                    alt={name}
                    style={{
                        maxWidth: 180,
                        maxHeight: 80,
                        objectFit: "contain",
                    }}
                />
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    {name}
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        mt: 2,
                        alignItems: "center",
                    }}
                >
                    <RoomIcon fontSize="small" />

                    <Typography color="text.secondary">
                        {city}
                    </Typography>
                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        mt: 1,
                        alignItems: "center",
                    }}
                >
                    <SportsEsportsIcon fontSize="small" />

                    <Typography color="text.secondary">
                        {boardCount} cible(s)
                    </Typography>
                </Stack>

                <Chip
                    color="success"
                    label={`${availableSlots} créneaux disponibles`}
                    sx={{
                        mt: 2,
                    }}
                />

            </CardContent>

            <CardActions
                sx={{
                    p: 2,
                }}
            >
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onPlanning}
                >
                    Voir le planning
                </Button>
            </CardActions>

        </Card>
    );
}