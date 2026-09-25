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

import {
    Timestamp,
} from "firebase/firestore";

import {
    attachReservation,
} from "@/entities/match";

import {
    getReservationPermissions,
} from "@/features/reservations/api/reservation-permissions.service";

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

            const reservationResult =
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

            await attachReservation(

                dialog.selection.matchId,

                reservationResult.reservationId,

            );

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

    function getPermissions() {

        if (!dialog.selection) {

            return {

                canCancel: false,

            };

        }

        return getReservationPermissions({

            reservation: {

                id: "",

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

                status: "PENDING",

                createdByUserId: "",

                createdAt:
                    dialog.selection.plannedStartAt,

                validatedByUserId: null,

                validatedAt: null,

                rejectedByUserId: null,

                rejectedAt: null,

                cancelledByUserId: null,

                cancelledAt: null,

                validationComment: "",

                notes:
                    dialog.selection.notes,

            },

            isPlayerOfMatch: true,

        });

    }

    const permissions = getPermissions();

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

        console.log("openSelection", {
            venueId,
            slot,
            board,
        });
        dialog.open({

            reservationDate,

            venueId,

            venueName,

            boardNumber: board.boardNumber,

            plannedStartAt:
                Timestamp.fromDate(
                    start,
                ),

            plannedEndAt:
                Timestamp.fromDate(
                    end,
                ),

        });

        if (matchId) {

            dialog.updateMatch(
                matchId,
            );

        }

        if (matchId) {

            dialog.updateMatch(
                matchId,
            );

        }

    }

    return {

        dialog,

        reservation,

        permissions,

        confirmReservation,

        openSelection,

    };

}