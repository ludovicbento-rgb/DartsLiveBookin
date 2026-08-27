import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    validateMatch,
} from "@/entities/match";

import {
    updateReservation,
} from "@/entities/reservation";

import {
    serverTimestamp,
} from "firebase/firestore";

export async function validateReservationCommand(
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

            status: "CONFIRMED",

            validatedByUserId:
                currentUser.uid,

            validatedAt:
                serverTimestamp(),

        },

    );

    await validateMatch(
        matchId,
    );

}