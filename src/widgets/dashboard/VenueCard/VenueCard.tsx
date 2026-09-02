import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
    useNavigate,
} from "react-router-dom";

import RoomIcon from "@mui/icons-material/Room";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

interface VenueCardProps {
    name: string;
    city: string;
    logo: string | null;
    boardCount: number;
    onPlanning: () => void;
}

export function VenueCard({
    name,
    city,
    logo,
    boardCount,
}: VenueCardProps) {
    const navigate =
        useNavigate();
    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            <CardContent>

                <Stack
                    spacing={2}
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <img
                        src={
                            logo
                                ? `/images/venues/${logo}`
                                : "/images/venues/default.jpg"
                        }
                        alt={name}
                        style={{
                            maxWidth: "180px",
                            maxHeight: "80px",
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
                        spacing={2}
                        sx={{
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
                        spacing={2}
                        sx={{
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
                        label="Ouvert"
                    />
                </Stack>

            </CardContent>

            <CardActions
                sx={{
                    p: 2,
                }}
            >
                <Button
                    variant="contained"
                    onClick={() =>
                        navigate("/matches")
                    }
                >
                    Mes matchs
                </Button>
                {

                }
            </CardActions>

        </Card>
    );
}