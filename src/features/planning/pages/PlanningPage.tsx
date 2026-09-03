import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Timestamp } from "firebase/firestore";
import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard, PageTitle } from "@/shared/ui";

import {
    usePlanning,
} from "../hooks/usePlanning";

import { PlanningHeader } from "../components/PlanningHeader";
import { PlanningTable } from "../components/PlanningTable";

import { useReservationDialog } from "@/features/reservations/hooks/useReservationDialog";
import { useCreateReservation } from "@/features/reservations/hooks/useCreateReservation";
import PlanningConfirmDrawer
    from "../components/PlanningConfirmDrawer";

import { useAuth } from "@/features/authentication/hooks/useAuth";
import { useParams } from "react-router-dom";
import {
    PlanningSummary,
} from "../components/PlanningSummary";
import {
    useSearchParams,
} from "react-router-dom";

import PlanningDateSelector
    from "../components/PlanningDateSelector";

import {
    getMatchPlanningContext,
} from "@/features/commands/match-planning.service";

import type {
    BoardSlot,
    TimeSlot,
} from "../model/planning.types";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    MY_MATCHES_ROUTE,
} from "@/shared/routing";

export function PlanningPage() {

    const { venueId } = useParams();
    const navigate =
        useNavigate();

    const [searchParams] =
        useSearchParams();

    const matchId =
        searchParams.get("matchId");

    const dialog = useReservationDialog();

    const [
        reservationDate,
        setReservationDate,
    ] = useState(
        new Date(),
    );

    const [
        reservationSuccess,
        setReservationSuccess,
    ] = useState(false);

    const {
        planning,
        loading,
        error,
    } = usePlanning(
        venueId ?? "",
        reservationDate,
    );

    const [
        selectedMatch,
        setSelectedMatch,
    ] = useState<
        Awaited<
            ReturnType<
                typeof getMatchPlanningContext
            >
        > | null
    >(null);

    useEffect(() => {

        async function loadMatch() {

            if (!matchId) {

                return;

            }

            const context =
                await getMatchPlanningContext(
                    matchId,
                );

            setSelectedMatch(
                context,
            );

        }

        loadMatch();

    }, [matchId]);

    const reservation = useCreateReservation();

    const {
        userProfile,
    } = useAuth();

    if (loading) {

        return (
            <AppLayout>
                <AppCard>
                    Chargement du planning...
                </AppCard>
            </AppLayout>
        );

    }

    if (error) {

        return (
            <AppLayout>
                <AppCard>
                    {error}
                </AppCard>
            </AppLayout>
        );

    }

    if (!planning) {

        return (
            <AppLayout>
                <AppCard>
                    Chargement...
                </AppCard>
            </AppLayout>
        );

    }

    const availableBoards =
        planning.slots
            .flatMap((slot: TimeSlot) => slot.boards)
            .filter((board: BoardSlot) =>
                board.status === "AVAILABLE",
            )
            .length;

    const reservedBoards =
        planning.slots
            .flatMap((slot: TimeSlot) => slot.boards)
            .filter((board: BoardSlot) =>
                board.status !== "AVAILABLE",
            )
            .length;
    const currentPlanning = planning;

    async function handleReservation() {
        if (!dialog.selection || !userProfile) {
            return;
        }

        try {

            await reservation.create({

                matchId:
                    dialog.selection.matchId,

                venueId:
                    currentPlanning.venueId,

                boardNumber:
                    dialog.selection.boardNumber,

                plannedStartAt:
                    dialog.selection.plannedStartAt,

                plannedEndAt:
                    dialog.selection.plannedEndAt,

                notes:
                    dialog.selection.notes,

            });

            dialog.close();

            setReservationSuccess(true);
            reservation.reset();
            setTimeout(() => {

                navigate(
                    MY_MATCHES_ROUTE,
                );

            }, 3000);


        } catch (e) {

            if (
                e instanceof Error &&
                e.message ===
                "BOARD_ALREADY_RESERVED"
            ) {

                alert(
                    "Cette cible vient d'être réservée."
                );

            }
            else {

                alert(
                    "Une erreur est survenue."
                );

            }

        }
    }

    function handleBoardSelected(
        slot: TimeSlot,
        board: BoardSlot,
    ) {

        const [h, m] =
            slot.startTime.split(":").map(Number);

        const start =
            new Date(
                reservationDate,
            );

        start.setHours(h, m, 0, 0);

        const end =
            new Date(
                reservationDate,
            );
        const [eh, em] =
            slot.endTime.split(":").map(Number);

        end.setHours(eh, em, 0, 0);



        dialog.open({

            reservationDate,

            venueId:
                currentPlanning.venueId,

            venueName:
                currentPlanning.venueName,

            boardNumber:
                board.boardNumber,

            plannedStartAt:
                Timestamp.fromDate(start),

            plannedEndAt:
                Timestamp.fromDate(end),

        });

        if (matchId) {

            dialog.updateMatch(
                matchId,
            );

        }
    }
    return (
        <AppLayout>
            <AppCard>
                <Stack spacing={4}>
                    <PageTitle>
                        Choix d'un créneau
                    </PageTitle>

                    <PlanningHeader
                        venueName={planning.venueName}
                        availableBoards={availableBoards}
                    />
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
                    <PlanningSummary

                        reservationDate={reservationDate}

                        availableBoards={availableBoards}

                        reservedBoards={reservedBoards}

                    />
                    <PlanningTable
                        planning={planning}
                        onBoardSelected={handleBoardSelected}
                    />

                    <PlanningConfirmDrawer

                        open={dialog.opened}

                        matchLabel={
                            selectedMatch
                                ? `J${selectedMatch.matchDay.number} - ${selectedMatch.homeRegistration.registrationName} vs ${selectedMatch.awayRegistration.registrationName}`
                                : ""
                        }

                        venueName={dialog.selection?.venueName ?? ""}

                        boardNumber={dialog.selection?.boardNumber ?? 0}

                        start={
                            dialog.selection
                                ? dialog.selection.plannedStartAt
                                    .toDate()
                                    .toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                : ""
                        }

                        end={
                            dialog.selection
                                ? dialog.selection.plannedEndAt
                                    .toDate()
                                    .toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                : ""
                        }

                        notes={dialog.selection?.notes ?? ""}

                        loading={reservation.loading}

                        onNotesChanged={dialog.updateNotes}

                        onClose={dialog.close}

                        onConfirm={handleReservation}

                    />

                    <Snackbar
                        open={reservation.error !== null}
                        autoHideDuration={4000}
                    >
                        <Alert severity="error">
                            {reservation.error}
                        </Alert>
                    </Snackbar>

                    <Snackbar
                        open={reservationSuccess}
                        autoHideDuration={3000}
                        onClose={() =>
                            setReservationSuccess(false)
                        }
                    >

                        <Alert
                            severity="success"
                        >

                            ✅ Votre demande a bien été envoyée.
                            Elle est en attente de validation
                            par le gérant.

                        </Alert>

                    </Snackbar>
                </Stack>
            </AppCard>
        </AppLayout>
    );
}

export default PlanningPage;