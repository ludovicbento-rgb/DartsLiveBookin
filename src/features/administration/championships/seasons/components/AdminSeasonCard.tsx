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

import CheckCircleIcon
    from "@mui/icons-material/CheckCircle";

import EmojiEventsIcon
    from "@mui/icons-material/EmojiEvents";

import type {
    Season,
} from "@/entities/season";

interface Props {

    season: Season;

    loading: boolean;

    onEdit(
        season: Season,
    ): void;

    onActivate(
        season: Season,
    ): void;

}

export function AdminSeasonCard({

    season,

    loading,

    onEdit,

    onActivate,

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

                            <EmojiEventsIcon
                                color={
                                    season.active
                                        ? "primary"
                                        : "disabled"
                                }
                            />

                            <Stack>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >

                                    {season.name}

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Saison de championnat

                                </Typography>

                            </Stack>

                        </Stack>

                        <Chip
                            size="small"
                            color={
                                season.active
                                    ? "success"
                                    : "default"
                            }
                            label={
                                season.active
                                    ? "Saison active"
                                    : "Inactive"
                            }
                        />

                    </Stack>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={1.5}
                    >

                        <Button
                            variant="outlined"
                            startIcon={
                                <EditIcon />
                            }
                            disabled={loading}
                            onClick={() =>
                                onEdit(
                                    season,
                                )
                            }
                        >

                            Modifier

                        </Button>

                        {
                            !season.active && (

                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={
                                        <CheckCircleIcon />
                                    }
                                    disabled={loading}
                                    onClick={() =>
                                        onActivate(
                                            season,
                                        )
                                    }
                                >

                                    Définir comme active

                                </Button>

                            )
                        }

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default AdminSeasonCard;