import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import CheckIcon
    from "@mui/icons-material/Check";

import type {
    ReservationValidationItem,
} from "../model/reservation-validation-item";

import {
    formatReservationDate,
} from "@/shared/utils/date";

import CloseIcon
    from "@mui/icons-material/Close";

interface Props {

    reservation: ReservationValidationItem;

    loading: boolean;

    onAccept: (
        reservation: ReservationValidationItem,
    ) => void;

    onReject: (
        reservation: ReservationValidationItem,
    ) => void;

}

export function ReservationValidationCard({

    reservation,

    loading,

    onAccept,

    onReject,

}: Props) {

    const timingLabel =
        reservation.daysBeforeReservation < 0
            ? "Date dépassée"
            : reservation.daysBeforeReservation <= 1
                ? "Urgent"
                : reservation.daysBeforeReservation <= 7
                    ? "Cette semaine"
                    : "Plus tard";

    const timingColor:
        "error" |
        "warning" |
        "success" =
        reservation.daysBeforeReservation <= 1
            ? "error"
            : reservation.daysBeforeReservation <= 7
                ? "warning"
                : "success";

    return (

        <Card
            variant="outlined"
        >

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={1}
                        sx={{
                            justifyContent:
                                "space-between",

                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            {`Journée ${reservation.matchDayNumber}`}

                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >

                            <Chip
                                size="small"
                                color="warning"
                                label="En attente"
                            />

                            <Chip
                                size="small"
                                color={timingColor}
                                label={timingLabel}
                            />

                        </Stack>

                    </Stack>

                    <Typography
                        variant="h5"
                        align="center"
                    >

                        {reservation.homeTeam}

                    </Typography>

                    <Typography
                        align="center"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        VS

                    </Typography>

                    <Typography
                        variant="h5"
                        align="center"
                    >

                        {reservation.awayTeam}

                    </Typography>

                    <Divider />

                    <Typography>

                        📍 {reservation.venueName}

                    </Typography>

                    <Typography>

                        {

                            formatReservationDate(

                                reservation.plannedStartAt.toDate(),

                            )

                        }

                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 600,
                        }}
                    >

                        {

                            reservation.plannedStartAt
                                .toDate()
                                .toLocaleTimeString(
                                    "fr-FR",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )

                        }

                        {" → "}

                        {

                            reservation.plannedEndAt
                                .toDate()
                                .toLocaleTimeString(
                                    "fr-FR",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )

                        }

                    </Typography>

                    <Typography>

                        🎯 Cible {reservation.boardNumber}

                    </Typography>

                    {

                        reservation.notes !== "" && (

                            <>

                                <Divider />

                                <Typography
                                    variant="subtitle2"
                                >

                                    Commentaire

                                </Typography>

                                <Typography>

                                    {reservation.notes}

                                </Typography>

                            </>

                        )

                    }

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                    >

                        <Button

                            fullWidth

                            color="success"

                            variant="contained"

                            size="large"

                            startIcon={<CheckIcon />}

                            disabled={loading}

                            onClick={() =>

                                onAccept(
                                    reservation,
                                )

                            }

                        >

                            Valider

                        </Button>

                        <Button

                            fullWidth

                            color="error"

                            variant="outlined"

                            size="large"

                            startIcon={<CloseIcon />}

                            disabled={loading}

                            onClick={() =>

                                onReject(
                                    reservation,
                                )

                            }

                        >

                            Refuser

                        </Button>

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default ReservationValidationCard;