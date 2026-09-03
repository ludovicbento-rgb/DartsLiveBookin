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

        const availableSlot = board.slots.find(

            slot => !slot.reserved,

        );

        if (availableSlot) {

            return {

                boardNumber:

                    board.boardNumber,

                slot:

                    availableSlot,

            };

        }

    }

    return null;

}