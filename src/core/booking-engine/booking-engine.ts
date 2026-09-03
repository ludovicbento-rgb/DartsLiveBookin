import type {
    PlanningBoard,
    ReservationSlot,
} from "@/core/reservation-engine";

import type {
    BookingValidationResult,
} from "./model/booking-validation-result";

export interface BookingRequest {

    planning: PlanningBoard[];

}

export interface BookingSuggestion {

    boardNumber: number;

    slot: ReservationSlot;

}

export function suggestAlternatives(

    request: BookingRequest,

): BookingSuggestion[] {

    const suggestions: BookingSuggestion[] = [];

    for (const board of request.planning) {

        for (const slot of board.slots) {

            if (!slot.reserved) {

                suggestions.push({

                    boardNumber:

                        board.boardNumber,

                    slot,

                });

            }

        }

    }

    return suggestions;

}

export function findBestSlot(

    request: BookingRequest,

): BookingSuggestion | null {

    const suggestions =

        suggestAlternatives(

            request,

        );

    return suggestions.length > 0

        ? suggestions[0]

        : null;

}

export function validateSelection(

    request: BookingRequest,

    boardNumber: number,

    startTime: string,

): BookingValidationResult {

    const board =

        request.planning.find(

            board =>

                board.boardNumber ===

                boardNumber,

        );

    if (!board) {

        return {

            available: false,

            alternatives:

                suggestAlternatives(

                    request,

                ),

        };

    }

    const slot =

        board.slots.find(

            slot =>

                slot.startTime ===

                startTime,

        );

    if (!slot) {

        return {

            available: false,

            alternatives:

                suggestAlternatives(

                    request,

                ),

        };

    }

    if (!slot.reserved) {

        return {

            available: true,

            alternatives: [],

        };

    }

    return {

        available: false,

        alternatives:

            suggestAlternatives(

                request,

            ),

    };

}