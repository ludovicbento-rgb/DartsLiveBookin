import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard, PageTitle } from "@/shared/ui";
import {
    useReservationNotifications,
} from "../hooks/useReservationNotifications";
import {
    usePlanning,
} from "../hooks/usePlanning";

import { PlanningHeader } from "../components/PlanningHeader";

import PlanningConfirmDrawer
    from "../components/PlanningConfirmDrawer";

import { useParams } from "react-router-dom";
import {
    useSearchParams,
} from "react-router-dom";

import PlanningDateSelector
    from "../components/PlanningDateSelector";

import {
    useMatchPlanningContext,
} from "../hooks/useMatchPlanningContext";


import type {
    BoardSlot,
    TimeSlot,
} from "../model/planning.types";

import {
    usePlanningReservation,
} from "../hooks/usePlanningReservation";

import {
    useState,
} from "react";

import {
    PlanningContent,
} from "../components/PlanningContent";

import {
    PlanningState,
} from "../components/PlanningState";

export function PlanningPage() {

    const { venueId } = useParams();

    const [searchParams] =
        useSearchParams();

    const matchId =
        searchParams.get("matchId");

    const [
        reservationDate,
        setReservationDate,
    ] = useState(
        new Date(),
    );

    const notifications =
        useReservationNotifications();

    const {
        reservation,
        dialog,
        confirmReservation,
        openSelection,
    } = usePlanningReservation(
        notifications,
    );

    const {
        planning,
        loading,
        error,
    } = usePlanning(
        venueId ?? "",
        reservationDate,
    );

    const {
        selectedMatch,
        loading: matchLoading,
        error: matchError,
    } = useMatchPlanningContext(
        matchId,
    );

    const currentPlanning = planning ?? null;

    const pageError =
        error ??
        matchError ??
        null;

    function handleBoardSelected(
        slot: TimeSlot,
        board: BoardSlot,
    ) {
        if (!currentPlanning) {
            return;
        }

        if (board.status !== "AVAILABLE") {
            return;
        }

        openSelection({
            venueId:
                currentPlanning.venueId,
            venueName:
                currentPlanning.venueName,
            reservationDate,
            matchId,
            slot,
            board,
        });

    }
    return (
        <AppLayout>
            <AppCard>
                <Stack spacing={4}>
                    <PageTitle>
                        Choix d'un créneau
                    </PageTitle>

                    {
                        planning && (
                            <PlanningHeader
                                planning={planning}
                            />
                        )
                    }
                    {
                        selectedMatch && (
                            <Alert
                                severity="info"
                            >
                                {
                                    selectedMatch.matchDay.displayName
                                }
                                {" - "}
                                {
                                    selectedMatch.homeRegistration.registrationName
                                }
                                {" vs "}
                                {
                                    selectedMatch.awayRegistration.registrationName
                                }
                            </Alert>
                        )
                    }

                    <PlanningDateSelector
                        value={reservationDate}
                        onChange={setReservationDate}
                    />
                    {
                        !loading &&
                        !error &&
                        planning && (
                            <PlanningContent
                                planning={planning}
                                reservationDate={reservationDate}
                                onBoardSelected={handleBoardSelected}
                            />
                        )
                    }

                    <PlanningState
                        loading={
                            loading ||
                            matchLoading
                        }

                        error={pageError}
                        empty={
                            !loading &&
                            !matchLoading &&
                            !pageError &&
                            !!planning &&
                            planning.slots.length === 0
                        }
                    />
                    <PlanningConfirmDrawer
                        start={
                            dialog.selection
                                ? dialog.selection.plannedStartAt
                                    .toDate()
                                    .toLocaleTimeString(
                                        "fr-FR",
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        },
                                    )
                                : ""
                        }
                        end={
                            dialog.selection
                                ? dialog.selection.plannedEndAt
                                    .toDate()
                                    .toLocaleTimeString(
                                        "fr-FR",
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        },
                                    )
                                : ""
                        }
                        open={dialog.opened}
                        matchLabel={
                            selectedMatch
                                ? `J${selectedMatch.matchDay.number} - ${selectedMatch.homeRegistration.registrationName} vs ${selectedMatch.awayRegistration.registrationName}`
                                : ""
                        }

                        venueName={dialog.selection?.venueName ?? ""}
                        boardNumber={dialog.selection?.boardNumber ?? 0}
                        notes={dialog.selection?.notes ?? ""}
                        loading={reservation.loading}
                        onNotesChanged={dialog.updateNotes}
                        onClose={dialog.close}
                        onConfirm={confirmReservation}

                    />

                    <Snackbar
                        open={notifications.notification.open}
                        autoHideDuration={4000}
                        onClose={notifications.hide}
                    >

                        <Alert
                            severity={notifications.notification.severity}
                        >
                            {notifications.notification.message}
                        </Alert>

                    </Snackbar>
                </Stack>
            </AppCard>
        </AppLayout>
    );
}

export default PlanningPage;