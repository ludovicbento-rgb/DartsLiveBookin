import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Timestamp } from "firebase/firestore";
import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard, PageTitle } from "@/shared/ui";

import { usePlanning } from "../hooks/usePlanning";
import { PlanningHeader } from "../components/PlanningHeader";
import { PlanningTable } from "../components/PlanningTable";

import { useReservationDialog } from "@/features/reservations/hooks/useReservationDialog";
import { ReservationDialog } from "@/features/reservations/components";
import { useCreateReservation } from "@/features/reservations/hooks/useCreateReservation";

import { useAuth } from "@/features/authentication/hooks/useAuth";
import { useParams } from "react-router-dom";

import {
    useSearchParams,
} from "react-router-dom";

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
    useMatchesToPlan,
} from "@/features/matches/hooks/useMatchesToPlan";

export function PlanningPage() {

    const { venueId } = useParams();

    const {
        planning,
        loading,
        error,
    } = usePlanning(
        venueId ?? "",
    );
    const [searchParams] =
        useSearchParams();

    const matchId =
        searchParams.get("matchId");

    const dialog = useReservationDialog();

    const {
        matches,
        loading: loadingMatches,
    } = useMatchesToPlan(undefined);

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

    const { user } = useAuth();

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
            .flatMap(slot => slot.boards)
            .filter(
                board =>
                    board.status === "AVAILABLE",
            )
            .length;
    const currentPlanning = planning;

    async function handleReservation() {
        if (!dialog.selection || !user) {
            return;
        }

        try {

            await reservation.create({

                matchId:
                    dialog.selection.matchId,

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

            reservation.reset();
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
        const today = new Date();

        const [h, m] =
            slot.startTime.split(":").map(Number);

        today.setHours(h, m, 0, 0);

        const end = new Date(today);

        const [eh, em] =
            slot.endTime.split(":").map(Number);

        end.setHours(eh, em, 0, 0);

        dialog.open({

            venueId:
                currentPlanning.venueId,

            venueName:
                currentPlanning.venueName,

            boardNumber:
                board.boardNumber,

            plannedStartAt:
                Timestamp.fromDate(today),

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
                    <PlanningTable
                        planning={planning}
                        onBoardSelected={handleBoardSelected}
                    />

                    <ReservationDialog

                        open={dialog.opened}

                        selection={dialog.selection}

                        matches={matches}

                        loadingMatches={loadingMatches}

                        loading={reservation.loading}

                        onClose={dialog.close}

                        onConfirm={handleReservation}

                        onNotesChanged={
                            dialog.updateNotes
                        }

                        onMatchChanged={
                            dialog.updateMatch
                        }

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
                        open={
                            reservation.result !== null
                        }
                        autoHideDuration={3000}
                        onClose={reservation.reset}
                    >
                        <Alert severity="success">

                            {reservation.result?.message}

                        </Alert>
                    </Snackbar>
                </Stack>
            </AppCard>
        </AppLayout>
    );
}

export default PlanningPage;