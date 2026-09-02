import {
    Alert,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
    Box,
} from "@mui/material";

import {
    imagePath,
} from "@/shared/utils/image";

import type {
    MyMatch,
} from "../model/my-match";

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

interface Props {

    match: MyMatch;

    onPlan: (
        match: MyMatch,
    ) => void;

}

export function MatchCard({

    match,

    onPlan,

}: Props) {

    const statusColor =

        match.status === "NOT_PLANNED"

            ? "warning"

            : match.status === "PENDING"

                ? "info"

                : "success";

    const statusLabel =

        match.status === "NOT_PLANNED"

            ? "À planifier"

            : match.status === "PENDING"

                ? "En attente"

                : "Planifié";

    return (

        <Card>

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 3,
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                alignItems: "center",
                            }}
                        >

                            <Box
                                component="img"
                                src={imagePath(
                                    "venues",
                                    match.venueLogo,
                                )}
                                alt={match.venueName}
                                sx={{
                                    width: 64,
                                    height: 64,
                                    objectFit: "contain",
                                }}
                            />

                            <Stack spacing={0}>

                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {match.venueName}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Établissement
                                </Typography>

                            </Stack>

                        </Stack>

                        <Chip

                            color={statusColor}

                            label={statusLabel}

                        />

                    </Stack>

                    <Stack
                        spacing={1}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {match.homeTeam}
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: "text.secondary",
                            }}
                        >
                            VS
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {match.awayTeam}
                        </Typography>

                    </Stack>

                    {

                        match.plannedStartAt && (

                            <Typography>

                                🕒 {

                                    match.plannedStartAt
                                        .toDate()
                                        .toLocaleString(
                                            "fr-FR",
                                        )

                                }

                            </Typography>

                        )

                    }

                    {

                        match.boardNumber && (

                            <Typography>

                                🎯 Cible {match.boardNumber}

                            </Typography>

                        )

                    }

                    {

                        match.notes !== "" && (

                            <Alert severity="warning">

                                {match.notes}

                            </Alert>

                        )

                    }

                    {

                        match.status === "NOT_PLANNED"

                            ? (

                                <Button
                                    startIcon={
                                        <CalendarMonthIcon />
                                    }
                                    variant="contained"

                                    fullWidth

                                    onClick={() =>
                                        onPlan(match)
                                    }

                                >

                                    Planifier

                                </Button>

                            )

                            : (

                                <Button

                                    fullWidth

                                    disabled

                                >

                                    {

                                        match.status === "PENDING"

                                            ? "En attente de validation"

                                            : "Déjà planifié"

                                    }

                                </Button>

                            )

                    }

                </Stack>

            </CardContent>

        </Card>

    );

}

export default MatchCard;