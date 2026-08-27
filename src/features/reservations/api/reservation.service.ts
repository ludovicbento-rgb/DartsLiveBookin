import { createReservationCommand } from "../../commands/createReservation";

import type { ReservationCommand } from "../model/reservation-command";

export interface ReservationResult {

    success: boolean;

    message: string;

}

export async function createReservation(

    command: ReservationCommand,

): Promise<ReservationResult> {

    await createReservationCommand(command);

    return {

        success: true,

        message:
            "Votre réservation a été envoyée au gérant.",

    };

}