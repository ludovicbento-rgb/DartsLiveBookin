import {
    getDocs,
    query,
    where,
} from "firebase/firestore";

import {
    seasonsCollection,
} from "./season.firestore";

import {
    mapSeason,
} from "./season.mapper";

import type {
    Season,
} from "./season.types";

export async function getActiveSeason(
): Promise<Season | null> {

    const q = query(

        seasonsCollection,

        where(
            "active",
            "==",
            true,
        ),

    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty) {

        return null;

    }

    return mapSeason(
        snapshot.docs[0],
    );

}