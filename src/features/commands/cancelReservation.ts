import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    cancelReservation,
} from "@/entities/reservation";

import {
    getReservation,
} from "@/entities/reservation";

import {
    detachReservation,
} from "@/entities/match";

export async function cancelReservationCommand(

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

    await cancelReservation(

        reservationId,

        currentUser.uid,

    );

    await detachReservation(

        reservation.matchId,

    );

}