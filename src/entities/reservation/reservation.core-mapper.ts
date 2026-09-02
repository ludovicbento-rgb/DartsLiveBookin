import type {
    Reservation as CoreReservation,
} from "@/core/reservation-engine";

import type {
    Reservation as ReservationEntity,
} from "./reservation.types";

export function mapCoreReservation(
    reservation: ReservationEntity,
): CoreReservation {
    {

        return {

            boardNumber:
                reservation.boardNumber,

            startTime:
                reservation.plannedStartAt
                    .toDate()
                    .toLocaleTimeString(
                        "fr-FR",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        },
                    ),

            endTime:
                reservation.plannedEndAt
                    .toDate()
                    .toLocaleTimeString(
                        "fr-FR",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        },
                    ),

        };

    }
}