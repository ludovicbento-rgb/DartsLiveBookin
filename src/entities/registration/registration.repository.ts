import {
    getDocs,
    query,
    where,
} from "firebase/firestore";

import {
    registrationsCollection,
} from "./registration.firestore";

import type {
    Registration,
} from "./registration.types";

export async function getPlayerRegistrations(
    playerUid: string,
): Promise<Registration[]> {

    const q = query(
        registrationsCollection,
        where(
            "playerUid",
            "==",
            playerUid,
        ),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {

        const data =
            doc.data() as Omit<Registration, "id">;

        return {
            id: doc.id,
            ...data,
        };

    });

}   