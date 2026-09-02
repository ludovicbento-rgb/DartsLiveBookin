
import type {
    OpeningHours,
    Reservation,
} from "@/core/reservation-engine";

import {
    mapPlanning,
} from "@/core/planning-mapper";

import type { VenuePlanning, } from "../model/planning.types";

import { buildPlanning, } from "@/core/reservation-engine";

export interface PlanningServiceInput {

    venueId: string;

    venueName: string;

    openingHours: OpeningHours;

    matchDurationMinutes: number;

    reservations: Reservation[];

}

export interface PlanningServiceResult {
    planning: VenuePlanning;
}

export function createPlanning(
    input: PlanningServiceInput,
): PlanningServiceResult {

    const planningBoards =

        buildPlanning(

            input.openingHours,

            input.matchDurationMinutes,

            input.reservations,

        );

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

    };

}

