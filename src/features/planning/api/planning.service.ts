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

import type {
    AvailabilityDecision,
} from "@/core/availability-engine";

export interface PlanningServiceResult {

    planning: VenuePlanning;

    suggestion:

    ReturnType<typeof findBestSlot>

    | null;

    availability: AvailabilityDecision;

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
    const availability = buildAvailability({

        openingHours,

        durationMinutes: 90,

        reservations,

        closures,

        rules: data.rules,

        reservationDate,

    });

    const planningBoards =
        availability.planning;

    const suggestion =

        availability.available

            ? findBestSlot({

                planning:

                    planningBoards,

            })

            : null;

    const planning =

        mapPlanning({

            venueId:
                data.venue.id,

            venueName:
                data.venue.name,

            planning:
                planningBoards,

            availability,

        })

    return {

        planning,

        suggestion,

        availability,

    };

}