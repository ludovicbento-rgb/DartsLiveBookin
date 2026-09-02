import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import type {
    ReservationValidationItem,
} from "../model/reservation-validation-item";

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

    return (

        <Card
            variant="outlined"
        >

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >

                        <Typography
                            variant="h6"
                        >

                            {`J${reservation.matchDayNumber}`}

                        </Typography>

                        <Chip

                            color="warning"

                            label="En attente"

                        />

                        {

                            reservation.isHomeMatch

                                ? (

                                    <Chip

                                        color="success"

                                        label="🏠 Domicile"

                                    />

                                )

                                : (

                                    <Chip

                                        color="info"

                                        label="🚗 Déplacement"

                                    />

                                )

                        }

                        <Chip

                            color={

                                reservation.daysBeforeReservation <= 1

                                    ? "error"

                                    : reservation.daysBeforeReservation <= 7

                                        ? "warning"

                                        : "success"

                            }

                            label={

                                reservation.daysBeforeReservation <= 1

                                    ? "Urgent"

                                    : reservation.daysBeforeReservation <= 7

                                        ? "Cette semaine"

                                        : "Plus tard"

                            }

                        />

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

                        🕒 {

                            reservation.plannedStartAt
                                .toDate()
                                .toLocaleString(
                                    "fr-FR",
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
                        direction="row"
                        spacing={2}
                    >

                        <Button

                            fullWidth

                            color="success"

                            variant="contained"

                            size="large"

                            disabled={loading}

                            onClick={() =>
                                onAccept(
                                    reservation,
                                )
                            }

                        >

                            ✓ Accepter

                        </Button>

                        <Button

                            fullWidth

                            color="error"

                            variant="outlined"

                            size="large"

                            disabled={loading}

                            onClick={() =>
                                onReject(
                                    reservation,
                                )
                            }

                        >

                            ✕ Refuser

                        </Button>

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default ReservationValidationCard;