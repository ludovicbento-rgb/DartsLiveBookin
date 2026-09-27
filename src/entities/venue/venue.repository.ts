import {
    getDoc,
    getDocs,
    query,
    where,
    addDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import {
    venueDocument,
    venuesCollection,
} from "./venue.firestore";

import {
    mapVenue,
} from "./venue.mapper";

import type { Venue } from "./venue.types";

export async function getVenuesManagedByUser(
    userId: string,
): Promise<Venue[]> {

    const q = query(

        venuesCollection,

        where(
            "managerUserIds",
            "array-contains",
            userId,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapVenue,
    );

}

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
            ...data,
        };
    });
}
export async function getManagedVenue(

    userId: string,

): Promise<Venue | null> {

    const q = query(

        venuesCollection,

        where(

            "managerUserIds",

            "array-contains",

            userId,

        ),

    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty) {

        return null;

    }

    return mapVenue(

        snapshot.docs[0],

    );

}

export interface CreateVenueRequest {

    name: string;

    city: string;

    address: string;

    boardCount: number;

    logo: string | null;

    active: boolean;

    managerUserIds: string[];

}

export interface UpdateVenueRequest {

    name: string;

    city: string;

    address: string;

    boardCount: number;

    logo: string | null;

    active: boolean;

    managerUserIds: string[];

}

export async function createVenue(

    request: CreateVenueRequest,

): Promise<string> {

    const document =
        await addDoc(

            venuesCollection,

            {

                name:
                    request.name,

                city:
                    request.city,

                address:
                    request.address,

                boardCount:
                    request.boardCount,

                logo:
                    request.logo,

                active:
                    request.active,

                managerUserIds:
                    request.managerUserIds,

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp(),

            },

        );

    return document.id;

}

export async function updateVenue(

    venueId: string,

    request: UpdateVenueRequest,

): Promise<void> {

    await updateDoc(

        venueDocument(
            venueId,
        ),

        {

            name:
                request.name,

            city:
                request.city,

            address:
                request.address,

            boardCount:
                request.boardCount,

            logo:
                request.logo,

            active:
                request.active,

            managerUserIds:
                request.managerUserIds,

            updatedAt:
                serverTimestamp(),

        },

    );

}