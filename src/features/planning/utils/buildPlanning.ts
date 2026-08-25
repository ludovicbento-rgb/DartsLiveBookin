import type {
    Reservation,
} from "@/entities/reservation";

import type {
    BoardSlot,
    VenuePlanning,
} from "../model/planning.types";

export function buildPlanning(
    venueId: string,
    venueName: string,
    boardCount: number,
    slots: {
        startTime: string;
        endTime: string;
    }[],
    reservations: Reservation[],
): VenuePlanning {

    return {

        venueId,

        venueName,

        slots: slots.map((slot, index) => ({

            id: `${index}`,

            startTime: slot.startTime,

            endTime: slot.endTime,

            boards: Array.from(
                { length: boardCount },
                (_, boardIndex): BoardSlot => {

                    const reserved =
                        reservations.some(
                            reservation =>
                                reservation.boardNumber === boardIndex + 1 &&
                                reservation.startAt.toDate().getHours() ===
                                Number(slot.startTime.split(":")[0]),
                        );

                    return {
                        boardNumber: boardIndex + 1,
                        available: !reserved,
                    };

                },
            ),

        })),

    };

}