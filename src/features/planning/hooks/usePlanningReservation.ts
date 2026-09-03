import {
    useNavigate,
} from "react-router-dom";

import {
    useReservationDialog,
} from "@/features/reservations/hooks/useReservationDialog";

import {
    useCreateReservation,
} from "@/features/reservations/hooks/useCreateReservation";

import {
    MY_MATCHES_ROUTE,
} from "@/shared/routing";

import type {
    BoardSlot,
    TimeSlot,
} from "../model/planning.types";

import type {
    useReservationNotifications,
} from "./useReservationNotifications";

interface OpenSelectionParams {

    venueId: string;

    venueName: string;

    reservationDate: Date;

    matchId: string | null;

    slot: TimeSlot;

    board: BoardSlot;

}

export function usePlanningReservation(

    notifications: ReturnType<
        typeof useReservationNotifications
    >,

) {

    const dialog = useReservationDialog();

    const reservation = useCreateReservation();

    const navigate = useNavigate();

    async function confirmReservation() {

        if (!dialog.selection) {

            return;

        }

        try {

            await reservation.create({

                matchId:
                    dialog.selection.matchId,

                venueId:
                    dialog.selection.venueId,

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

            notifications.success(

                "Votre demande a bien été envoyée.",

            );

            navigate(

                MY_MATCHES_ROUTE,

            );

        }

        catch (e) {

            if (

                e instanceof Error &&

                e.message ===

                "BOARD_ALREADY_RESERVED"

            ) {

                notifications.error(

                    "Cette cible vient d'être réservée.",

                );

            }

            else {

                notifications.error(

                    "Une erreur est survenue.",

                );

            }

        }

    }
    function openSelection({

        venueId,

        venueName,

        reservationDate,

        matchId,

        slot,

        board,

    }: OpenSelectionParams) {

        const [

            startHour,

            startMinute,

        ] = slot.startTime
            .split(":")
            .map(Number);

        const [

            endHour,

            endMinute,

        ] = slot.endTime
            .split(":")
            .map(Number);

        const start = new Date(
            reservationDate,
        );

        start.setHours(
            startHour,
            startMinute,
            0,
            0,
        );

        const end = new Date(
            reservationDate,
        );

        end.setHours(
            endHour,
            endMinute,
            0,
            0,
        );

        openSelection({
            venueId,
            venueName,
            reservationDate,
            matchId,
            slot,
            board,
        });

        if (matchId) {

            dialog.updateMatch(
                matchId,
            );

        }

    }

    return {

        dialog,

        reservation,

        confirmReservation,

        openSelection,

    };

}