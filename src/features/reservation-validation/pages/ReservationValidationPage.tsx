import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AppLayout } from "@/app/layouts/AppLayout";
import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

import {
    usePendingReservations,
} from "../hooks/usePendingReservations";

import {
    ReservationValidationCard,
} from "../components/ReservationValidationCard";

import type {
    ReservationValidationItem,
} from "../model/reservation-validation-item";
import { useReservationValidation } from "../api/useReservationValidation";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import { useCurrentUser } from "@/features/authentication/hooks/useCurrentUser";

export function ReservationValidationPage() {
    const profile =
        useCurrentUser();
    const {

        reservations,

        loading,
    } = usePendingReservations(
        profile?.id ?? "",
    );

    const validation =
        useReservationValidation();

    const [
        success,
        setSuccess,
    ] = useState(false);

    async function handleAccept(
        reservation: ReservationValidationItem,
    ) {

        await validation.accept(
            reservation,
        );

        setSuccess(true);

    }

    async function handleReject(
        reservation: ReservationValidationItem,
    ) {

        // Nous ajouterons le motif
        // dans la PR suivante.

        await validation.reject(
            reservation,
            "",
        );

    }

    if (loading) {

        return (

            <AppLayout>

                <AppCard>

                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <CircularProgress />

                        <Typography>

                            Chargement...

                        </Typography>

                    </Stack>

                </AppCard>

            </AppLayout>

        );

    }

    return (

        <AppLayout>

            <AppCard>

                <Stack spacing={3}>

                    <PageTitle>

                        Demandes de réservation

                    </PageTitle>

                    <Typography
                        color="text.secondary"
                    >

                        {

                            reservations.length

                        }

                        {

                            reservations.length <= 1

                                ? " demande en attente"

                                : " demandes en attente"

                        }

                    </Typography>

                    {

                        reservations.length === 0 && (

                            <Alert
                                severity="success"
                            >

                                Aucune demande
                                en attente.

                            </Alert>

                        )

                    }

                    {

                        reservations.map(

                            reservation => (

                                <ReservationValidationCard

                                    key={
                                        reservation.reservationId
                                    }

                                    reservation={reservation}

                                    loading={validation.loading}

                                    onAccept={handleAccept}

                                    onReject={handleReject}

                                />

                            ),

                        )

                    }

                </Stack>

                <Snackbar
                    open={success}
                    autoHideDuration={3000}
                    onClose={() =>
                        setSuccess(false)
                    }
                >

                    <Alert
                        severity="success"
                    >

                        Réservation validée.

                    </Alert>

                </Snackbar>

            </AppCard>

        </AppLayout>

    );

}

export default ReservationValidationPage;