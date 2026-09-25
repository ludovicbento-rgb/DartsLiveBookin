import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    getUserByAuthUid,
} from "@/entities/user";

import {
    cancelReservation,
    getReservation,
} from "@/entities/reservation";

import {
    detachReservation,
} from "@/entities/match";

export async function cancelReservationCommand(
    reservationId: string,
): Promise<void> {

    console.log(
        "CANCEL_1_START",
        reservationId,
    );

    const currentUser =
        authService.getCurrentUser();

    console.log(
        "CANCEL_2_AUTH_USER",
        currentUser?.uid,
    );

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    const userProfile =
        await getUserByAuthUid(
            currentUser.uid,
        );

    console.log(
        "CANCEL_3_USER_PROFILE",
        userProfile?.id,
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

    console.log(
        "CANCEL_4_RESERVATION",
        reservation?.id,
        reservation?.status,
        reservation?.matchId,
    );

    if (!reservation) {

        throw new Error(
            "RESERVATION_NOT_FOUND",
        );

    }

    console.log(
        "CANCEL_5_BEFORE_RESERVATION_UPDATE",
        {
            reservationId,
            cancelledByUserId:
                userProfile.id,
        },
    );

    await cancelReservation(
        reservationId,
        userProfile.id,
    );

    console.log(
        "CANCEL_6_RESERVATION_UPDATED",
    );

    await detachReservation(
        reservation.matchId,
    );

    console.log(
        "CANCEL_7_MATCH_DETACHED",
    );

}