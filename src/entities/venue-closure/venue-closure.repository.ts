import {
    getDocs,
    query,
    where,
} from "firebase/firestore";

import {
    venueClosuresCollection,
} from "./venue-closure.firestore";

import {
    mapVenueClosure,
} from "./venue-closure.mapper";

import type {
    VenueClosure,
} from "./venue-closure.types";

export async function getVenueClosuresByVenue(
    venueId: string,
): Promise<VenueClosure[]> {
    const q = query(
        venueClosuresCollection,
        where(
            "venueId",
            "==",
            venueId,
        ),

        where(
            "active",
            "==",
            true,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapVenueClosure,
    );

}