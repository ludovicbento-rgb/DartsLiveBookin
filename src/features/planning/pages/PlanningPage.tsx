import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard, } from "@/shared/ui";
import {
    useReservationNotifications,
} from "../hooks/useReservationNotifications";
import {
    usePlanning,
} from "../hooks/usePlanning";

import PlanningConfirmDrawer
    from "../components/PlanningConfirmDrawer";

import { useParams } from "react-router-dom";
import {
    useSearchParams,
} from "react-router-dom";

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
    buildVenueStatus,
} from "@/entities/venue/venue-status.service";

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

    const venueStatus = buildVenueStatus({

        isOpen: true,

        hasEvent: false,

        hasMaintenance: false,

        availableBoards:
            planning
                ? planning.slots
                    .flatMap(
                        slot => slot.boards,
                    )
                    .filter(
                        board =>
                            board.status === "AVAILABLE",
                    ).length
                : 0,

    });

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

        console.log("handleBoardSelected", slot, board);

    }
    return (
        <AppLayout>
            <AppCard>
                <Stack spacing={4}>

                    {
                        !loading &&
                        !error &&
                        planning && (

                            <PlanningContent
                                planning={planning}
                                reservationDate={reservationDate}
                                onReservationDateChanged={
                                    setReservationDate
                                }
                                homeTeam={
                                    selectedMatch?.homeRegistration.registrationName ?? ""
                                }
                                awayTeam={
                                    selectedMatch?.awayRegistration.registrationName ?? ""
                                }
                                venueLogo={
                                    selectedMatch?.venue.logo ?? ""
                                }
                                onBoardSelected={
                                    handleBoardSelected
                                }

                                venueStatus={venueStatus}
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
                        reservationDate={reservationDate}
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

                        homeTeam={
                            selectedMatch?.homeRegistration.registrationName ?? ""
                        }

                        awayTeam={
                            selectedMatch?.awayRegistration.registrationName ?? ""
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