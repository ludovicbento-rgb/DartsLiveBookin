import {
    buildAvailability,
} from "@/core/availability-engine";

import {
    findBestSlot,
} from "@/core/booking-engine";

import {
    mapPlanning,
} from "@/core/planning-mapper";

import {
    mapOpeningHours,
} from "@/entities/venue-schedule";

import {
    mapCoreReservation,
} from "@/entities/reservation";

import {
    mapAvailabilityClosure,
} from "@/entities/venue-closure";

import type {
    PlanningData,
} from "./planning.loader";

import type {
    VenuePlanning,
} from "../model/planning.types";

export interface PlanningServiceResult {

    planning: VenuePlanning;

    suggestion: ReturnType<typeof findBestSlot>;

}

export function createPlanning(

    data: PlanningData,

    reservationDate: Date,

): PlanningServiceResult {
    const openingHours =

        mapOpeningHours(

            data.schedules[0],

        );

    const reservations =

        data.reservations.map(

            mapCoreReservation,

        );

    const closures =

        data.closures.map(

            mapAvailabilityClosure,

        );
    const planningBoards = buildAvailability({
        openingHours,
        durationMinutes: 90,
        reservations,
        closures,
        reservationDate,
    });

    const suggestion =

        findBestSlot({

            planning:
                planningBoards,

        });

    const planning =

        mapPlanning({

            venueId:
                data.venue.id,

            venueName:
                data.venue.name,

            planning:
                planningBoards,

        });

    return {

        planning,

        suggestion,

    };

}