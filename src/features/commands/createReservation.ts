import {
    createReservation,
} from "@/entities/reservation";

import type {
    CreateReservationRequest,
} from "@/entities/reservation";

export async function createReservationCommand(
    request: CreateReservationRequest,
) {
    await createReservation(request);
}