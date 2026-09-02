import type {
    OpeningHours,
    ReservationSlot,
} from "./index";

import {
    toMinutes,
    toTime,
} from "./index";

export function buildReservationSlots(
    openingHours: OpeningHours,
    durationMinutes: number,
): ReservationSlot[] {

    const slots: ReservationSlot[] = [];

    const open =
        toMinutes(openingHours.openTime);

    const close =
        toMinutes(openingHours.closeTime);

    for (const boardNumber of openingHours.boardNumbers) {

        let current = open;

        while (

            current + durationMinutes <= close

        ) {

            slots.push({

                boardNumber,

                startTime: toTime(current),

                endTime: toTime(
                    current + durationMinutes,
                ),

                reserved: false,

            });

            current += durationMinutes;

        }

    }

    return slots;

}