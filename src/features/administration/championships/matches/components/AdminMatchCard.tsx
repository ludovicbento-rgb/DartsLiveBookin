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

import SportsEsportsIcon
    from "@mui/icons-material/SportsEsports";

import type {
    Match,
    MatchStatus,
} from "@/entities/match";

interface Props {

    match: Match;

    homeName: string;

    awayName: string;

    onEdit(
        match: Match,
    ): void;

}

function getStatusLabel(
    status: MatchStatus,
): string {

    switch (status) {

        case "NOT_PLANNED":
            return "Non planifié";

        case "PENDING":
            return "Réservation en attente";

        case "PLANNED":
            return "Planifié";

    }

}

function getStatusColor(
    status: MatchStatus,
):
    | "default"
    | "warning"
    | "success" {

    switch (status) {

        case "NOT_PLANNED":
            return "default";

        case "PENDING":
            return "warning";

        case "PLANNED":
            return "success";

    }

}

export function AdminMatchCard({

    match,

    homeName,

    awayName,

    onEdit,

}: Props) {

    const editable =
        match.status ===
        "NOT_PLANNED"
        &&
        match.plannedReservationId ===
        null;

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

                            <SportsEsportsIcon
                                color="primary"
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >

                                Rencontre

                            </Typography>

                        </Stack>

                        <Chip
                            size="small"
                            color={
                                getStatusColor(
                                    match.status,
                                )
                            }
                            label={
                                getStatusLabel(
                                    match.status,
                                )
                            }
                        />

                    </Stack>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        sx={{
                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            py: 1,
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                flex: 1,

                                textAlign: {
                                    xs: "center",
                                    sm: "right",
                                },

                                fontWeight: 700,
                            }}
                        >

                            {homeName}

                        </Typography>

                        <Chip
                            label="VS"
                            variant="outlined"
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                flex: 1,

                                textAlign: {
                                    xs: "center",
                                    sm: "left",
                                },

                                fontWeight: 700,
                            }}
                        >

                            {awayName}

                        </Typography>

                    </Stack>

                    {
                        match.plannedReservationId && (

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                Une réservation est associée à cette rencontre.

                            </Typography>

                        )
                    }

                    <Button
                        variant="outlined"
                        startIcon={
                            <EditIcon />
                        }
                        disabled={
                            !editable
                        }
                        onClick={() =>
                            onEdit(
                                match,
                            )
                        }
                    >

                        {
                            editable
                                ? "Modifier"
                                : "Modification verrouillée"
                        }

                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default AdminMatchCard;