import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Drawer,
    Stack,
    Typography,
} from "@mui/material";

import type {
    Reservation,
} from "@/entities/reservation";

import {
    useState,
} from "react";

interface Props {

    open: boolean;

    loading: boolean;

    reservation: Reservation | null;

    matchDayNumber: number;

    homeTeam: string;

    awayTeam: string;

    venueName: string;

    canCancel: boolean;

    onClose(): void;

    onCancel(): void;

}

export function ReservationDrawer({

    open,

    loading,

    reservation,

    matchDayNumber,

    homeTeam,

    awayTeam,

    venueName,

    canCancel,

    onClose,

    onCancel,

}: Props) {

    if (!reservation) {

        return null;

    }

    const [

        confirmCancel,

        setConfirmCancel,

    ] = useState(false);

    const statusColor =

        reservation.status === "PENDING"

            ? "warning"

            : reservation.status === "CONFIRMED"

                ? "success"

                : reservation.status === "REJECTED"

                    ? "error"

                    : "default";

    const statusLabel =

        reservation.status === "PENDING"

            ? "En attente"

            : reservation.status === "CONFIRMED"

                ? "Validée"

                : reservation.status === "REJECTED"

                    ? "Refusée"

                    : "Annulée";

    const reservationDate =

        reservation.plannedStartAt.toDate();

    const start =

        reservation.plannedStartAt

            .toDate()

            .toLocaleTimeString(

                "fr-FR",

                {

                    hour: "2-digit",

                    minute: "2-digit",

                },

            );

    const end =

        reservation.plannedEndAt

            .toDate()

            .toLocaleTimeString(

                "fr-FR",

                {

                    hour: "2-digit",

                    minute: "2-digit",

                },

            );

    return (

        <Drawer

            anchor="bottom"

            open={open}

            onClose={onClose}

            slotProps={{

                paper: {

                    sx: {

                        borderTopLeftRadius: 24,

                        borderTopRightRadius: 24,

                        maxHeight: "90vh",

                    },

                },

            }}

        >

            <Box

                sx={{

                    width: 48,

                    height: 5,

                    bgcolor: "grey.400",

                    borderRadius: 999,

                    mx: "auto",

                    mt: 2,

                    mb: 2,

                }}

            />

            <Box

                sx={{

                    maxWidth: 720,

                    mx: "auto",

                    px: 3,

                    pb: 4,

                    width: "100%",

                }}

            >

                <Stack spacing={2}>

                    <Stack

                        direction="row"

                        sx={{

                            justifyContent: "space-between",

                            alignItems: "center",

                        }}

                    >

                        <Typography

                            variant="h5"

                            sx={{

                                fontWeight: 700,

                            }}

                        >

                            Détails de la réservation

                        </Typography>

                        <Chip

                            color={statusColor}

                            label={statusLabel}

                            size="medium"

                            sx={{

                                fontWeight: 700,

                                px: 1,

                            }}

                        />

                    </Stack>

                    <Alert

                        severity={

                            reservation.status === "CONFIRMED"

                                ? "success"

                                : reservation.status === "REJECTED"

                                    ? "error"

                                    : reservation.status === "CANCELLED"

                                        ? "info"

                                        : "warning"

                        }

                    >

                        {

                            reservation.status === "PENDING"

                            && "Votre réservation est en attente de validation par le gérant."

                        }

                        {

                            reservation.status === "CONFIRMED"

                            && "Votre réservation est confirmée."

                        }

                        {

                            reservation.status === "REJECTED"

                            && "Votre réservation a été refusée."

                        }

                        {

                            reservation.status === "CANCELLED"

                            && "Cette réservation est annulée."

                        }

                    </Alert>

                    <Card

                        variant="outlined"
                        sx={{

                            bgcolor: "background.default"

                        }}


                    >

                        <CardContent sx={{

                            pb: 2,

                        }}>

                            <Stack spacing={1}>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    🏆 MATCH
                                </Typography>

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Journée {matchDayNumber}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        textAlign: "center",
                                    }}
                                >
                                    {homeTeam}{" "}
                                    <Typography
                                        component="span"
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 500,
                                        }}
                                    >
                                        VS
                                    </Typography>{" "}
                                    {awayTeam}
                                </Typography>

                            </Stack>

                        </CardContent>

                    </Card>

                    <Card

                        variant="outlined"
                        sx={{

                            bgcolor: "background.default"

                        }}


                    >

                        <CardContent sx={{

                            pb: 2,

                        }}>

                            <Stack spacing={2}>

                                <Stack spacing={0.5}>

                                    <Typography

                                        sx={{

                                            fontWeight: 600,

                                        }}

                                    >

                                        {venueName}

                                    </Typography>

                                </Stack>

                                <Divider />

                                <Stack spacing={0.5}>

                                    <Typography>

                                        {

                                            reservationDate.toLocaleDateString(

                                                "fr-FR",

                                                {

                                                    weekday: "long",

                                                    day: "numeric",

                                                    month: "long",

                                                    year: "numeric",

                                                },

                                            )

                                        }

                                    </Typography>

                                    <Typography

                                        sx={{

                                            fontWeight: 700,

                                        }}

                                    >

                                        {start} → {end}

                                    </Typography>

                                </Stack>

                                <Divider />

                                <Stack spacing={0.5}>


                                    <Typography

                                        sx={{

                                            fontWeight: 600,

                                        }}

                                    >

                                        Cible {reservation.boardNumber}

                                    </Typography>

                                </Stack>

                                <Divider />

                                <Stack spacing={0.5}>

                                    <Typography

                                        variant="caption"

                                        color="text.secondary"

                                    >

                                        💬 Commentaire

                                    </Typography>

                                    <Typography>

                                        {

                                            reservation.notes === ""

                                                ? "Aucun commentaire du joueur."

                                                : reservation.notes

                                        }

                                    </Typography>

                                    <Typography

                                        variant="caption"

                                        color="text.secondary"

                                    >

                                        Le gérant pourra consulter ce commentaire lors de la validation de votre réservation.

                                    </Typography>

                                </Stack>

                            </Stack>

                        </CardContent>

                    </Card>

                    {

                        canCancel && (

                            <Button

                                color="error"

                                variant="contained"

                                disabled={loading}

                                onClick={onCancel}

                            >

                                Annuler la réservation

                            </Button>

                        )

                    }

                    {

                        confirmCancel && (

                            <Card

                                variant="outlined"

                                sx={{

                                    borderColor: "error.main",

                                    bgcolor: "error.50",

                                }}

                            >

                                <CardContent>

                                    <Stack spacing={2}>

                                        <Typography

                                            variant="h6"

                                            color="error.main"

                                            sx={{

                                                fontWeight: 700,

                                            }}

                                        >

                                            Confirmer l'annulation

                                        </Typography>

                                        <Typography>

                                            Êtes-vous certain de vouloir annuler cette réservation ?

                                        </Typography>

                                        <Typography

                                            variant="body2"

                                            color="text.secondary"

                                        >

                                            Le créneau redeviendra immédiatement disponible.

                                        </Typography>

                                        <Stack

                                            direction="row"

                                            spacing={2}

                                        >

                                            <Button

                                                fullWidth

                                                variant="outlined"

                                                onClick={() =>

                                                    setConfirmCancel(false)

                                                }

                                            >

                                                Retour

                                            </Button>

                                            <Button

                                                fullWidth

                                                color="error"

                                                variant="contained"

                                                disabled={loading}

                                                onClick={async () => {

                                                    setConfirmCancel(false);

                                                    await onCancel();

                                                }}

                                            >

                                                Oui, annuler

                                            </Button>

                                        </Stack>

                                    </Stack>

                                </CardContent>

                            </Card>

                        )

                    }

                    <Button

                        fullWidth

                        variant="outlined"

                        onClick={onClose}

                        sx={{

                            mt: 1,

                        }}

                    >

                        Fermer

                    </Button>

                </Stack>

            </Box>

        </Drawer >

    );

}

export default ReservationDrawer;            