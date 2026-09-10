import {
    cancelReservationCommand,
} from "../../commands/cancelReservation";

export async function cancelReservationService(

    reservationId: string,

): Promise<void> {

    await cancelReservationCommand(

        reservationId,

    );

}