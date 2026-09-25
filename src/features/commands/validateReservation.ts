import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    getUserByAuthUid,
} from "@/entities/user";

import {
    getReservation,
    validateReservation,
} from "@/entities/reservation";

import {
    validateMatch,
} from "@/entities/match";

export async function validateReservationCommand(

    reservationId: string,

): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    /*
     * Résolution du profil métier.
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

    const reservation =
        await getReservation(
            reservationId,
        );

    if (!reservation) {

        throw new Error(
            "RESERVATION_NOT_FOUND",
        );

    }

    /*
     * validatedByUserId contient
     * l'ID métier users/<id>.
     */
    await validateReservation(

        reservationId,

        userProfile.id,

    );

    /*
     * Match :
     *
     * PENDING
     *   ↓
     * PLANNED
     */
    await validateMatch(
        reservation.matchId,
    );

}