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

import CheckCircleIcon
    from "@mui/icons-material/CheckCircle";

interface Props {

    match: MyMatch;

    onPlan: (
        match: MyMatch,
    ) => void;

    onReservation: (
        match: MyMatch,
    ) => void;

}

export function MatchCard({

    match,

    onPlan,

    onReservation,


}: Props) {

    /*
     * ============================================================
     * ETAT SPORTIF
     * ============================================================
     */

    const isPlayed =
        match.playStatus ===
        "PLAYED";

    /*
     * ============================================================
     * BADGE
     * ============================================================
     *
     * PLAYED est prioritaire sur le statut de réservation.
     */

    const statusColor =

        isPlayed

            ? "success"

            : match.status ===
                "NOT_PLANNED"

                ? "warning"

                : match.status ===
                    "PENDING"

                    ? "info"

                    : "success";

    const statusLabel =

        isPlayed

            ? "Joué"

            : match.status ===
                "NOT_PLANNED"

                ? "À planifier"

                : match.status ===
                    "PENDING"

                    ? "En attente"

                    : "Planifié";
    /*
     * ============================================================
     * ACTION PLANIFIER
     * ============================================================
     */

    function handlePlan() {

        /*
        * Double protection UI.
        *
        * Un match joué ne doit jamais
        * ouvrir le parcours de réservation.
        */
        if (isPlayed) {

            return;

        }

        onPlan(
            match,
        );

    }

    return (

        <Card>

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction="row"
                        sx={{
                            justifyContent:
                                "space-between",

                            alignItems:
                                "flex-start",

                            mb: 3,
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                alignItems:
                                    "center",
                            }}
                        >

                            <Box
                                component="img"
                                src={
                                    imagePath(
                                        "venues",
                                        match.venueLogo,
                                    )
                                }
                                alt={
                                    match.venueName
                                }
                                sx={{
                                    width: 64,
                                    height: 64,
                                    objectFit:
                                        "contain",
                                }}
                            />

                            <Stack spacing={0}>

                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >

                                    {
                                        match.venueName
                                    }

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
                            color={
                                statusColor
                            }
                            label={
                                statusLabel
                            }
                        />

                    </Stack>

                    <Stack
                        spacing={1}
                        sx={{
                            alignItems:
                                "center",
                        }}
                    >

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            {
                                match.homeTeam
                            }

                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
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

                            {
                                match.awayTeam
                            }

                        </Typography>

                    </Stack>

                    {
                        match.plannedStartAt && (

                            <Typography>

                                🕒{" "}

                                {
                                    match
                                        .plannedStartAt
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

                                🎯 Cible{" "}

                                {
                                    match.boardNumber
                                }

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

                    {/*
                     * =================================================
                     * MATCH JOUE
                     * =================================================
                     */}

                    {
                        /*
                         * ============================================================
                         * MATCH DEJA JOUE
                         * ============================================================
                         *
                         * Prioritaire sur tous les statuts de réservation.
                         */
                        isPlayed

                            ? (

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="success"
                                    disabled
                                    startIcon={
                                        <CheckCircleIcon />
                                    }
                                >

                                    Match joué

                                </Button>

                            )

                            : match.status ===
                                "NOT_PLANNED"

                                ? (

                                    /*
                                     * =================================================
                                     * MATCH A PLANIFIER
                                     * =================================================
                                     */

                                    <Button
                                        startIcon={
                                            <CalendarMonthIcon />
                                        }
                                        variant="contained"
                                        fullWidth
                                        onClick={() =>
                                            handlePlan()
                                        }
                                    >

                                        Planifier

                                    </Button>

                                )

                                : (

                                    /*
                                     * =================================================
                                     * RESERVATION EXISTANTE
                                     * =================================================
                                     *
                                     * PENDING ou PLANNED :
                                     * on conserve le parcours existant.
                                     */

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() =>
                                            onReservation(
                                                match,
                                            )
                                        }
                                    >

                                        {
                                            match.status ===
                                                "PENDING"

                                                ? "Voir la réservation en attente"

                                                : "Voir la réservation"
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