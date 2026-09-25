import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    attachReservation,
} from "@/entities/match";

import {
    createReservation,
} from "@/entities/reservation";

import {
    getUserByAuthUid,
} from "@/entities/user";

import type {
    ReservationCommand,
} from "@/features/reservations/model/reservation-command";

import {
    getMatchPlanningContext,
} from "@/features/commands/match-planning.service";

export async function createReservationCommand(
    command: ReservationCommand,
): Promise<string> {

    /*
     * Utilisateur Firebase actuellement connecté.
     */
    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    /*
     * Résolution de l'utilisateur métier :
     *
     * Firebase UID
     *      ↓
     * user-auth/<uid>
     *      ↓
     * users/<userId>
     */
    const userProfile =
        await getUserByAuthUid(
            currentUser.uid,
        );

    if (!userProfile) {

        throw new Error(
            "USER_PROFILE_NOT_FOUND",
        );

    }

    /*
     * Vérification du match AVANT de créer
     * la réservation.
     */
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

    console.log(
        "CREATE_1_BEFORE_RESERVATION",
        {
            matchId: command.matchId,
            venueId: command.venueId,
            createdByUserId: userProfile.id,
        },
    );


    /*
     * Création de la réservation.
     *
     * IMPORTANT :
     * createdByUserId contient l'ID métier
     * users/<id>, pas le Firebase UID.
     */
    const reservationId =
        await createReservation({

            matchId:
                command.matchId,

            venueId:
                command.venueId,

            boardNumber:
                command.boardNumber,

            plannedStartAt:
                command.plannedStartAt,

            plannedEndAt:
                command.plannedEndAt,

            createdByUserId:
                userProfile.id,

            notes:
                command.notes,

        });

    console.log(
        "CREATE_2_RESERVATION_CREATED",
        reservationId,
    );

    console.log(
        "CREATE_3_BEFORE_ATTACH",
        {
            matchId: command.matchId,
            reservationId,
        },
    );

    /*
     * Association de la réservation au match.
     */
    await attachReservation(

        command.matchId,

        reservationId,

    );

    console.log(
        "CREATE_4_MATCH_ATTACHED");

    return reservationId;

}