import type {
    PlanningBoard,
} from "@/core/reservation-engine";

import type {
    VenuePlanning,
    TimeSlot,
    BoardSlot,
} from "@/features/planning/model/planning.types";

import type {
    AvailabilityDecision,
} from "@/core/availability-engine";


interface PlanningMapperInput {

    venueId: string;

    venueName: string;

    planning: PlanningBoard[];

    availability: AvailabilityDecision;

}

export function mapPlanning({

    venueId,

    venueName,

    planning,

    availability,

}: PlanningMapperInput): VenuePlanning {

    const slotsMap = new Map<string, TimeSlot>();

    for (const board of planning) {

        for (const slot of board.slots) {

            const key =
                `${slot.startTime}-${slot.endTime}`;

            let timeSlot =
                slotsMap.get(key);

            if (!timeSlot) {

                timeSlot = {

                    startTime:
                        slot.startTime,

                    endTime:
                        slot.endTime,

                    boards: [],

                };

                slotsMap.set(
                    key,
                    timeSlot,
                );

            }

            const boardSlot: BoardSlot = {

                boardNumber:
                    board.boardNumber,

                status:

                    slot.reserved

                        ? "CONFIRMED"

                        : "AVAILABLE",

            };

            timeSlot.boards.push(
                boardSlot,
            );

        }

    }

    return {

        venueId,

        venueName,

        boardCount:

            planning.length,

        slots:

            Array.from(
                slotsMap.values(),
            ),

        availability: {

            decision:

                availability,

        },

    };

}