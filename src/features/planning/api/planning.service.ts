import {
    buildAvailability,
    type AvailabilityClosure,
} from "@/core/availability-engine";

import {
    findBestSlot,
} from "@/core/booking-engine";

import {
    mapPlanning,
} from "@/core/planning-mapper";

import type {
    OpeningHours,
    Reservation,
} from "@/core/reservation-engine";

import type { VenuePlanning } from "../model/planning.types";

export interface PlanningServiceInput {

    venueId: string;

    venueName: string;

    openingHours: OpeningHours;

    matchDurationMinutes: number;

    reservations: Reservation[];

    closures: AvailabilityClosure[];

    reservationDate: Date;

}

export interface PlanningServiceResult {

    planning: VenuePlanning;

    suggestion: ReturnType<typeof findBestSlot>;

}

export function createPlanning(

    input: PlanningServiceInput,

): PlanningServiceResult {

    const planningBoards =

        buildAvailability({

            openingHours:
                input.openingHours,

            durationMinutes:
                input.matchDurationMinutes,

            reservations:
                input.reservations,

            closures:
                input.closures,

            reservationDate:
                input.reservationDate,

        });

    const suggestion =

        findBestSlot({

            planning:
                planningBoards,

        });

    const planning =

        mapPlanning({

            venueId:
                input.venueId,

            venueName:
                input.venueName,

            planning:
                planningBoards,

        });

    return {

        planning,

        suggestion,

    };

}

