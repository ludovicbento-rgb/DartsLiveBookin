import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { Timestamp } from "firebase/firestore";
import { useCurrentUser } from "@/features/authentication/hooks/useCurrentUser";
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

import type {
    BoardSlot,
    TimeSlot,
} from "../model/planning.types";

export function PlanningPage() {
    const { venueId } = useParams();
    const profile = useCurrentUser();

    const planning = usePlanning(
        venueId ?? "",
    );

    const dialog = useReservationDialog();

    const reservation = useCreateReservation();

    const { user } = useAuth();

    if (!planning) {

        return (
            <AppLayout>
                <AppCard>
                    Chargement...
                </AppCard>
            </AppLayout>
        );

    }

    if (!profile) {
        return (
            <AppLayout>
                <AppCard>
                    Chargement du profil...
                </AppCard>
            </AppLayout>
        );
    }

    const currentProfile = profile;
    const availableBoards =
        planning.slots
            .flatMap(slot => slot.boards)
            .filter(board => board.available)
            .length;
    const currentPlanning = planning;

    async function handleReservation() {
        if (!dialog.selection || !user) {
            return;
        }

        try {

            await reservation.create({
                seasonId: currentProfile.seasonId,

                venueId: currentPlanning.venueId,

                registrationId: "registration-demo",

                playerUid: user.uid,

                boardNumber: dialog.selection.boardNumber,

                startAt: dialog.selection.startAt,

                endAt: dialog.selection.endAt,
            });

            dialog.close();
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
            venueId: currentPlanning.venueId,
            venueName: currentPlanning.venueName,
            boardNumber: board.boardNumber,
            startAt: Timestamp.fromDate(today),
            endAt: Timestamp.fromDate(end),
        });
    }
    return (
        <AppLayout>
            <AppCard>
                <Stack spacing={4}>
                    <PageTitle>
                        Planning des réservations
                    </PageTitle>

                    <PlanningHeader
                        venueName={planning.venueName}
                        availableBoards={availableBoards}
                    />

                    <PlanningTable
                        planning={planning}
                        onBoardSelected={handleBoardSelected}
                    />

                    <ReservationDialog
                        open={dialog.opened}
                        selection={dialog.selection}
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
                </Stack>
            </AppCard>
        </AppLayout>
    );
}

export default PlanningPage;