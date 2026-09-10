import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import {
    useNavigate,
} from "react-router-dom";

import {
    useState,
} from "react";

import { AppLayout } from "@/app/layouts/AppLayout";

import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

import {
    planningMatchRoute,
} from "@/shared/routing";

import {
    useAuth,
} from "@/features/authentication/hooks/useAuth";

import {
    useMyMatches,
} from "../hooks/useMyMatches";

import type {
    MyMatch,
} from "../model/my-match";

import {
    MatchPager,
} from "../components/MatchPager/MatchPager";

import ReservationDrawer
    from "../../reservations/components/ReservationDrawer";

import {
    useReservation,
} from "@/features/reservations/hooks";

import {
    useCancelReservation,
} from "@/features/reservations/hooks/useCancelReservation";

import {
    useReservationNotifications,
} from "@/features/planning/hooks/useReservationNotifications";

import CancelReservationDialog
    from "@/features/reservations/components/CancelReservationDialog";

export function MyMatchesPage() {

    const navigate =
        useNavigate();

    const {

        userProfile,

    } = useAuth();

    const {

        matches,

        loading,

        reload,

    } = useMyMatches(

        userProfile?.id,

    );

    const [

        selectedMatch,

        setSelectedMatch,

    ] = useState<MyMatch | null>(
        null,
    );

    const [

        cancelDialogOpen,

        setCancelDialogOpen,

    ] = useState(false);

    const {

        reservation,

        loading: reservationLoading,

    } = useReservation(

        selectedMatch?.reservationId,

    );

    const cancelReservation =
        useCancelReservation();

    const notifications =
        useReservationNotifications();

    function handlePlan(

        match: MyMatch,

    ) {

        navigate(

            planningMatchRoute(

                match.venueId,

                match.matchId,

            ),

        );

    }

    function handleReservation(

        match: MyMatch,

    ) {

        setSelectedMatch(

            match,

        );

    }

    function closeReservation() {

        setSelectedMatch(

            null,

        );

    }

    if (loading) {

        return (

            <AppLayout>

                <AppCard>

                    <Stack spacing={2}>

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

                        Mes matchs

                    </PageTitle>

                    {

                        matches.length === 0 && (

                            <Alert severity="info">

                                Aucun match à afficher.

                            </Alert>

                        )

                    }

                    {

                        matches.length > 0 && (

                            <MatchPager

                                matches={matches}

                                onPlan={handlePlan}

                                onReservation={
                                    handleReservation
                                }

                            />

                        )

                    }

                    {

                        selectedMatch && (
                            <>
                                <ReservationDrawer

                                    open={
                                        selectedMatch !== null
                                    }

                                    reservation={reservation}

                                    loading={
                                        reservationLoading
                                    }

                                    matchDayNumber={
                                        selectedMatch?.matchDayNumber ?? 0
                                    }

                                    homeTeam={
                                        selectedMatch?.homeTeam ?? ""
                                    }

                                    awayTeam={
                                        selectedMatch?.awayTeam ?? ""
                                    }

                                    venueName={
                                        selectedMatch?.venueName ?? ""
                                    }

                                    canCancel={
                                        reservation

                                            ? reservation.status !== "CANCELLED"

                                            : false
                                    }

                                    onClose={
                                        closeReservation
                                    }

                                    onCancel={() => {

                                        setCancelDialogOpen(true);

                                    }}

                                />
                                <CancelReservationDialog

                                    open={cancelDialogOpen}

                                    loading={cancelReservation.loading}

                                    onClose={() => {

                                        setCancelDialogOpen(false);

                                    }}

                                    onConfirm={async () => {

                                        if (!reservation) {

                                            return;

                                        }

                                        try {

                                            await cancelReservation.cancel(

                                                reservation.id,

                                            );

                                            setCancelDialogOpen(false);

                                            closeReservation();

                                            await reload();

                                            notifications.success(

                                                "Votre réservation a été annulée.",

                                            );

                                        }

                                        catch {

                                            notifications.error(

                                                "Impossible d'annuler la réservation.",

                                            );

                                        }

                                    }}

                                />
                            </>
                        )

                    }



                </Stack>

            </AppCard>

        </AppLayout>

    );

}

export default MyMatchesPage;   