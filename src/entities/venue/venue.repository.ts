import {
    getDoc,
    getDocs,
} from "firebase/firestore";

import {
    venueDocument,
    venuesCollection,
} from "./venue.firestore";

import type { Venue } from "./venue.types";

export async function getVenue(
    venueId: string,
): Promise<Venue | null> {
    const snapshot = await getDoc(
        venueDocument(venueId),
    );

    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.data() as Omit<Venue, "id">;

    return {
        id: snapshot.id,
        ...data,
    };
}

export async function getVenues(): Promise<Venue[]> {
    const snapshot = await getDocs(
        venuesCollection,
    );

    return snapshot.docs.map((doc) => {
        const data =
            doc.data() as Omit<Venue, "id">;

        return {
            id: doc.id,
            ...(doc.data() as Omit<Venue, "id">),
        };
    });
}