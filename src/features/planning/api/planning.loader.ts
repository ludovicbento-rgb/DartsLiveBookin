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
export interface PlanningData {
    venue: Venue;
    schedules: VenueSchedule[];
    reservations: Reservation[];
    closures: VenueClosure[];
}

export async function loadPlanningData(
    venueId: string,
    reservationDate: Date,
): Promise<PlanningData> {

    const venue = await getVenue(venueId);

    if (!venue) { throw new Error("VENUE_NOT_FOUND"); }

    const schedules = await getVenueSchedules(venueId);

    const reservations = await getReservationsByVenueAndDay(
        venueId,
        reservationDate,
    );

    const closures = await getVenueClosuresByVenue(venueId,);

    return {
        venue,
        schedules,
        reservations,
        closures,
    };
}