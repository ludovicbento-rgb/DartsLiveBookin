import type {
    Reservation,
} from "@/entities/reservation";

import type {
    BoardSlot,
    BoardStatus,
    TimeSlot,
    VenuePlanning,
} from "../model/planning.types";

interface ReservationSlot {

    startTime: string;

    endTime: string;

}

export function buildPlanning(

    venueId: string,

    venueName: string,

    boardCount: number,

    slots: ReservationSlot[],

    reservations: Reservation[],

): VenuePlanning {

    const planningSlots: TimeSlot[] = slots.map(slot => {

        const boards: BoardSlot[] = [];

        for (

            let boardNumber = 1;

            boardNumber <= boardCount;

            boardNumber++

        ) {

            const reservation =
                reservations.find(r => {

                    const reservationStart =
                        r.plannedStartAt
                            .toDate()
                            .toLocaleTimeString(
                                "fr-FR",
                                {

                                    hour: "2-digit",

                                    minute: "2-digit",

                                },
                            );

                    return (

                        r.boardNumber === boardNumber &&

                        reservationStart === slot.startTime

                    );

                });

            let status: BoardStatus =
                "AVAILABLE";

            if (reservation) {

                switch (reservation.status) {

                    case "PENDING":

                        status = "PENDING";

                        break;

                    case "CONFIRMED":

                        status = "CONFIRMED";

                        break;

                    default:

                        status = "AVAILABLE";

                }

            }

            boards.push({

                boardNumber,

                status,

                reservationId:
                    reservation?.id,

            });

        }

        return {

            startTime:
                slot.startTime,

            endTime:
                slot.endTime,

            boards,

        };

    });

    return {

        venueId,

        venueName,

        boardCount,

        slots: planningSlots,

    };

}