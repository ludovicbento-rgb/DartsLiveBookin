import {
    attachReservation,
} from "@/entities/match";

import {
    createReservation,
} from "@/entities/reservation";

import type {
    CreateReservationRequest,
} from "@/entities/reservation";

export async function bookReservation(

    request: CreateReservationRequest,

): Promise<string> {

    const reservationId =

        await createReservation(

            request,

        );

    await attachReservation(

        request.matchId,

        reservationId,

    );

    return reservationId;

}