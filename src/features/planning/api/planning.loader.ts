import {
    getVenue,
} from "@/entities/venue";

import type {
    Venue,
} from "@/entities/venue";

import {
    getVenueSchedules,
} from "@/entities/venue-schedule";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

import type {
    Reservation,
} from "@/entities/reservation";

import {
    getReservationsByVenueAndDay,
} from "@/entities/reservation";

import type {
    VenueClosure,
} from "@/entities/venue-closure";

import {
    getVenueClosuresByVenue,
} from "@/entities/venue-closure";

import type {
    AvailabilityRule,
} from "@/entities/availability-rule";

import {
    getAvailabilityRulesByVenue,
} from "@/entities/availability-rule";

import {
    getConfiguration,
} from "@/entities/configuration";

import type {
    Configuration,
} from "@/entities/configuration";

export interface PlanningData {
    venue: Venue;
    schedules: VenueSchedule[];
    reservations: Reservation[];
    closures: VenueClosure[];
    rules: AvailabilityRule[];
    configuration: Configuration;
}

export async function loadPlanningData(
    venueId: string,
    reservationDate: Date,
): Promise<PlanningData> {

    const venue = await getVenue(venueId);

    if (!venue) { throw new Error("VENUE_NOT_FOUND"); }

    const [

        schedules,

        reservations,

        closures,

        rules,

        configuration,

    ] = await Promise.all([

        getVenueSchedules(
            venueId,
        ),

        getReservationsByVenueAndDay(
            venueId,
            reservationDate,
        ),

        getVenueClosuresByVenue(
            venueId,
        ),

        getAvailabilityRulesByVenue(
            venueId,
        ),

        getConfiguration(),

    ]);

    return {
        venue,
        schedules,
        reservations,
        closures,
        rules,
        configuration,
    };
}