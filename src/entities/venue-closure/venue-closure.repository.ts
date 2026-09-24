import {
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    Timestamp,
    updateDoc,
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

export interface UpdateVenueClosureInput {

    startDate: Date;

    endDate: Date;

    reasonType: VenueClosureReason;

    comment: string;

}

export async function deleteVenueClosure(
    closureId: string,
): Promise<void> {

    const reference =
        doc(
            venueClosuresCollection,
            closureId,
        );

    await deleteDoc(
        reference,
    );

}

export async function updateVenueClosure(

    closureId: string,

    input: UpdateVenueClosureInput,

): Promise<void> {

    const reference =
        doc(
            venueClosuresCollection,
            closureId,
        );

    await updateDoc(

        reference,

        {
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

        },

    );

}

export async function setVenueClosureActive(

    closureId: string,

    active: boolean,

): Promise<void> {

    const reference =
        doc(
            venueClosuresCollection,
            closureId,
        );

    await updateDoc(

        reference,

        {
            active,
        },

    );

}

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