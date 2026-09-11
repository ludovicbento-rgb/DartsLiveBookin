import {
    authService,
} from "@/features/authentication/api/auth.service";

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

    const reservation =
        await getReservation(
            reservationId,
        );

    if (!reservation) {

        throw new Error(
            "RESERVATION_NOT_FOUND",
        );

    }

    await rejectReservation(

        reservationId,

        currentUser.uid,

        reason,

    );

    await detachReservation(

        reservation.matchId,

    );

}