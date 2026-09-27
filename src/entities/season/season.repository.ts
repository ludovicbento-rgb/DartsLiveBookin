import {
    addDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";

import {
    mapSeason,
} from "./season.mapper";

import type {
    Season,
} from "./season.types";

import {
    db,
} from "@/shared/firebase";

import {
    seasonDocument,
    seasonsCollection,
} from "./season.firestore";

export async function getSeasons():
    Promise<Season[]> {

    const snapshot =
        await getDocs(
            seasonsCollection,
        );

    return snapshot.docs.map(
        mapSeason,
    );

}

export async function createSeason(
    name: string,
): Promise<string> {

    const document =
        await addDoc(

            seasonsCollection,

            {
                name:
                    name.trim(),

                active:
                    false,

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp(),
            },

        );

    return document.id;

}

export async function updateSeason(

    seasonId: string,

    name: string,

): Promise<void> {

    await updateDoc(

        seasonDocument(
            seasonId,
        ),

        {
            name:
                name.trim(),

            updatedAt:
                serverTimestamp(),
        },

    );

}

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

export async function activateSeason(
    seasonId: string,
): Promise<void> {

    const snapshot =
        await getDocs(
            seasonsCollection,
        );

    const targetExists =
        snapshot.docs.some(
            document =>
                document.id ===
                seasonId,
        );

    if (!targetExists) {

        throw new Error(
            "SEASON_NOT_FOUND",
        );

    }

    const batch =
        writeBatch(
            db,
        );

    for (
        const document
        of snapshot.docs
    ) {

        const data =
            document.data();

        const shouldBeActive =
            document.id ===
            seasonId;

        /*
         * On évite les écritures inutiles.
         */
        if (
            data.active ===
            shouldBeActive
        ) {

            continue;

        }

        batch.update(

            document.ref,

            {
                active:
                    shouldBeActive,

                updatedAt:
                    serverTimestamp(),
            },

        );

    }

    await batch.commit();

}