import {
    validateReservationCommand,
} from "../../commands/validateReservation";

export async function validateReservationService(

    reservationId: string,

): Promise<void> {

    await validateReservationCommand(

        reservationId,

    );

}