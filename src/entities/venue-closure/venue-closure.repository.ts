import {
    addDoc,
    getDocs,
    query,
    Timestamp,
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
    VenueClosureReason,
} from "./venue-closure.types";

export interface CreateVenueClosureInput {

    venueId: string;

    startDate: Date;

    endDate: Date;

    reasonType: VenueClosureReason;

    comment: string;

}

export async function createVenueClosure(

    input: CreateVenueClosureInput,

): Promise<string> {

    const reference =
        await addDoc(

            venueClosuresCollection,

            {

                venueId:
                    input.venueId,

                startDate:
                    Timestamp.fromDate(
                        input.startDate,
                    ),

                endDate:
                    Timestamp.fromDate(
                        input.endDate,
                    ),

                reasonType:
                    input.reasonType,

                comment:
                    input.comment,

                active: true,

            },

        );

    return reference.id;

}

export async function getAllVenueClosuresByVenue(
    venueId: string,
): Promise<VenueClosure[]> {

    const q = query(

        venueClosuresCollection,

        where(
            "venueId",
            "==",
            venueId,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapVenueClosure,
    );

}
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