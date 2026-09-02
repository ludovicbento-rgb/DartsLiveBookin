import type {
    OpeningHours,
    PlanningBoard,
    Reservation,
} from "./index";

import {
    buildReservationSlots,
} from "./index";

export function buildPlanning(

    openingHours: OpeningHours,

    durationMinutes: number,

    reservations: Reservation[],

): PlanningBoard[] {

    const slots =
        buildReservationSlots(

            openingHours,

            durationMinutes,

        );

    const boards =

        openingHours.boardNumbers.map(

            boardNumber => ({

                boardNumber,

                slots:

                    slots

                        .filter(

                            slot =>

                                slot.boardNumber ===
                                boardNumber,

                        )

                        .map(slot => ({

                            ...slot,

                            reserved:

                                reservations.some(

                                    reservation =>

                                        reservation.boardNumber ===
                                        slot.boardNumber &&

                                        reservation.startTime ===
                                        slot.startTime,

                                ),

                        })),

            }),

        );

    return boards;

}