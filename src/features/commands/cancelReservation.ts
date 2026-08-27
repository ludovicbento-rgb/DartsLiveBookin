import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    detachReservation,
} from "@/entities/match";

import {
    updateReservation,
} from "@/entities/reservation";

import {
    serverTimestamp,
} from "firebase/firestore";

export async function cancelReservationCommand(
    reservationId: string,
    matchId: string,
): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    await updateReservation(

        reservationId,

        {

            status: "CANCELLED",

            cancelledByUserId:
                currentUser.uid,

            cancelledAt:
                serverTimestamp(),

        },

    );

    await detachReservation(
        matchId,
    );

}