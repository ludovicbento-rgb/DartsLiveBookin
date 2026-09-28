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

import EmojiEventsIcon
    from "@mui/icons-material/EmojiEvents";

import type {
    Competition,
    CompetitionType,
} from "@/entities/competition";

interface Props {

    competition: Competition;

    onEdit(
        competition: Competition,
    ): void;

}

function getModeLabel(
    mode: CompetitionType,
): string {

    switch (mode) {

        case "INDIVIDUAL":
            return "Individuel";

        case "DOUBLES":
            return "Doublettes";

        case "TEAM":
            return "Équipes";

    }

}

export function AdminCompetitionCard({

    competition,

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

                            <EmojiEventsIcon
                                color="primary"
                            />

                            <Stack>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >

                                    {competition.name}

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    {getModeLabel(
                                        competition.type,
                                    )}

                                </Typography>

                            </Stack>

                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1}
                        >

                            <Chip
                                size="small"
                                label={
                                    getModeLabel(
                                        competition.type,
                                    )
                                }
                                variant="outlined"
                            />

                            <Chip
                                size="small"
                                color={
                                    competition.active
                                        ? "success"
                                        : "default"
                                }
                                label={
                                    competition.active
                                        ? "Active"
                                        : "Inactive"
                                }
                            />

                        </Stack>

                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={
                            <EditIcon />
                        }
                        onClick={() =>
                            onEdit(
                                competition,
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

export default AdminCompetitionCard;