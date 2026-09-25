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

import {
    RejectReservationDrawer,
} from "../components/RejectReservationDrawer";

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

        reload,

    } = usePendingReservations(
        profile?.id ?? "",
    );

    const validation =
        useReservationValidation();

    const [
        success,
        setSuccess,
    ] = useState(false);

    const [

        rejectDrawerOpen,

        setRejectDrawerOpen,

    ] = useState(false);

    const [

        selectedReservation,

        setSelectedReservation,

    ] = useState<ReservationValidationItem | null>(null);


    const [

        rejectReason,

        setRejectReason,

    ] = useState("");

    async function handleAccept(

        reservation: ReservationValidationItem,

    ) {

        try {

            await validation.accept(

                reservation,

            );

            await reload();

            setSuccess(true);

        }

        catch (error) {

            console.error(
                "RESERVATION_ACCEPT_FAILED",
                error,
            );

        }

    }

    function handleReject(

        reservation: ReservationValidationItem,

    ) {

        setSelectedReservation(

            reservation,

        );

        setRejectReason("");

        setRejectDrawerOpen(true);

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

                        Réservations à valider

                    </PageTitle>

                    <Typography
                        color="text.secondary"
                    >

                        {

                            reservations.length

                        }

                        {

                            reservations.length <= 1

                                ? " réservation à traiter"

                                : " réservations à traiter"

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

                                    key={reservation.reservationId}

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

                <RejectReservationDrawer

                    open={rejectDrawerOpen}

                    loading={validation.loading}

                    reason={rejectReason}

                    onReasonChange={setRejectReason}

                    onClose={() => {

                        setRejectDrawerOpen(false);

                        setSelectedReservation(null);

                        setRejectReason("");

                    }}

                    onConfirm={async () => {

                        if (!selectedReservation) {

                            return;

                        }

                        try {

                            await validation.reject(

                                selectedReservation,

                                rejectReason,

                            );

                            setRejectDrawerOpen(false);

                            setSelectedReservation(null);

                            setRejectReason("");

                            await reload();

                            setSuccess(true);

                        }

                        catch (error) {

                            console.error(
                                "RESERVATION_REJECT_FAILED",
                                error,
                            );
                        }

                    }}

                />

            </AppCard>

        </AppLayout>

    );

}

export default ReservationValidationPage;