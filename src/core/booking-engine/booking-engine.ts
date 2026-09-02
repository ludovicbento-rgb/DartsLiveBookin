import type {
    PlanningBoard,
    ReservationSlot,
} from "@/core/reservation-engine";

export interface BookingRequest {

    planning: PlanningBoard[];

}

export interface BookingSuggestion {

    boardNumber: number;

    slot: ReservationSlot;

}

export function findBestSlot(

    request: BookingRequest,

): BookingSuggestion | null {

    for (const board of request.planning) {

        const slot = board.slots.find(

            slot => !slot.reserved,

        );

        if (slot) {

            return {

                boardNumber:

                    board.boardNumber,

                slot,

            };

        }

    }

    return null;

}