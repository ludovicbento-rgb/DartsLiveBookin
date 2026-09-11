import {

    getDocs,

    query,

    where,

} from "firebase/firestore";

import {

    unavailableSlotsCollection,

} from "./unavailable-slot.firestore";

import {

    mapUnavailableSlot,

} from "./unavailable-slot.mapper";

import type {

    UnavailableSlot,

} from "./unavailable-slot.types";

export async function getUnavailableSlotsByVenue(

    venueId: string,

): Promise<UnavailableSlot[]> {

    const q = query(

        unavailableSlotsCollection,

        where(

            "venueId",

            "==",

            venueId,

        ),

    );

    const snapshot =

        await getDocs(

            q,

        );

    return snapshot.docs.map(

        mapUnavailableSlot,

    );

}