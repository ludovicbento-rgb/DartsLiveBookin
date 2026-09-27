import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import EditIcon
    from "@mui/icons-material/Edit";

import StorefrontIcon
    from "@mui/icons-material/Storefront";

import SportsEsportsIcon
    from "@mui/icons-material/SportsEsports";

import type {
    Venue,
} from "@/entities/venue";

interface Props {

    venue: Venue;

    managerNames: string[];

    onEdit(
        venue: Venue,
    ): void;

}

export function AdminVenueCard({

    venue,

    managerNames,

    onEdit,

}: Props) {

    return (

        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
            }}
        >

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        sx={{
                            justifyContent:
                                "space-between",

                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{
                                alignItems:
                                    "center",
                            }}
                        >

                            <StorefrontIcon
                                color="primary"
                            />

                            <Stack>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >

                                    {venue.name}

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    {venue.city}

                                </Typography>

                            </Stack>

                        </Stack>

                        <Chip
                            size="small"
                            color={
                                venue.active
                                    ? "success"
                                    : "default"
                            }
                            label={
                                venue.active
                                    ? "Actif"
                                    : "Inactif"
                            }
                        />

                    </Stack>

                    {
                        venue.address.trim() !== "" && (

                            <Typography variant="body2">

                                📍 {venue.address}

                            </Typography>

                        )
                    }

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <SportsEsportsIcon
                            fontSize="small"
                        />

                        <Typography variant="body2">

                            {venue.boardCount}
                            {" "}
                            {
                                venue.boardCount > 1
                                    ? "cibles"
                                    : "cible"
                            }

                        </Typography>

                    </Stack>

                    <Stack spacing={1}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Gérants

                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >

                            {
                                managerNames.length > 0
                                    ? managerNames.map(
                                        managerName => (

                                            <Chip
                                                key={managerName}
                                                size="small"
                                                label={managerName}
                                                variant="outlined"
                                            />

                                        ),
                                    )
                                    : (

                                        <Chip
                                            size="small"
                                            label="Aucun gérant"
                                            variant="outlined"
                                        />

                                    )
                            }

                        </Stack>

                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={
                            <EditIcon />
                        }
                        onClick={() =>
                            onEdit(
                                venue,
                            )
                        }
                    >

                        Modifier

                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default AdminVenueCard;  