import {
    getAllVenueClosuresByVenue,
} from "@/entities/venue-closure";

import type {
    VenueClosure,
} from "@/entities/venue-closure";

export async function loadVenueClosures(
    venueId: string,
): Promise<VenueClosure[]> {

    return getAllVenueClosuresByVenue(
        venueId,
    );

}