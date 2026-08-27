import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    attachReservation,
} from "@/entities/match";

import {
    createReservation,
} from "@/entities/reservation";

import type {
    ReservationCommand,
} from "@/features/reservations/model/reservation-command";

import {
    getMatchPlanningContext,
} from "@/features/commands/match-planning.service";
export async function createReservationCommand(
    command: ReservationCommand,
): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    const reservationId =
        await createReservation({

            matchId:
                command.matchId,

            boardNumber:
                command.boardNumber,

            plannedStartAt:
                command.plannedStartAt,

            plannedEndAt:
                command.plannedEndAt,

            createdByUserId:
                currentUser.uid,

            notes:
                command.notes,

        });

    const context =
        await getMatchPlanningContext(
            command.matchId,
        );

    if (
        context.match.status !==
        "NOT_PLANNED"
    ) {

        throw new Error(
            "MATCH_ALREADY_PLANNED",
        );

    }

    await attachReservation(

        command.matchId,

        reservationId,

    );

}