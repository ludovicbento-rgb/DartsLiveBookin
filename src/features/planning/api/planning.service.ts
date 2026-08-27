import { getConfiguration } from "@/entities/configuration";
import {
    getReservationsByVenueAndDay,
    subscribeReservations,
} from "@/entities/reservation";
import {
    getVenue,
} from "@/entities/venue";

import type {
    VenuePlanning,
} from "../model/planning.types";

import {
    buildPlanning,
} from "../utils/buildPlanning";

export async function loadPlanning(
    venueId: string,
): Promise<VenuePlanning> {

    const [
        configuration,
        venue,
    ] = await Promise.all([

        getConfiguration(),

        getVenue(venueId),

    ]);

    if (!venue) {

        throw new Error(
            "Legacy planning removed",
        );

    }

    const reservations =
        await getReservationsByVenueAndDay(
            venue.id,
            new Date(),
        );

    return buildPlanning(

        venue.id,

        venue.name,

        venue.boardCount,

        configuration.reservationSlots,

        reservations,

    );

}

export function subscribePlanning(
    venueId: string,
    onPlanning: (
        planning: VenuePlanning,
    ) => void,
): () => void {

    return subscribeReservations(

        venueId,

        new Date(),

        async reservations => {

            const [
                configuration,
                venue,
            ] = await Promise.all([

                getConfiguration(),

                getVenue(venueId),

            ]);

            if (!venue) {
                return;
            }

            onPlanning(

                buildPlanning(

                    venue.id,

                    venue.name,

                    venue.boardCount,

                    configuration.reservationSlots,

                    reservations,

                ),

            );

        },

    );

}