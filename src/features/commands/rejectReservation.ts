import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    getUserByAuthUid,
} from "@/entities/user";

import {
    getReservation,
    rejectReservation,
} from "@/entities/reservation";

import {
    detachReservation,
} from "@/entities/match";

export async function rejectReservationCommand(

    reservationId: string,

    reason: string,

): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    /*
     * Résolution de l'utilisateur métier.
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
     * Le rejectedByUserId doit contenir
     * l'ID métier users/<id>.
     */
    await rejectReservation(

        reservationId,

        userProfile.id,

        reason,

    );

    /*
     * La réservation étant refusée,
     * le match redevient planifiable :
     *
     * PENDING
     *   ↓
     * NOT_PLANNED
     */
    await detachReservation(
        reservation.matchId,
    );

}