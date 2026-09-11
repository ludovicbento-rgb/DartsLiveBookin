import {
    authService,
} from "@/features/authentication/api/auth.service";

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

    const reservation =
        await getReservation(
            reservationId,
        );

    if (!reservation) {

        throw new Error(
            "RESERVATION_NOT_FOUND",
        );

    }

    await validateReservation(

        reservationId,

        currentUser.uid,

    );

    await validateMatch(

        reservation.matchId,

    );

}