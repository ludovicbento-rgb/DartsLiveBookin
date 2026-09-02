import {
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

import {
    matchesCollection,
} from "@/entities/match";

export function subscribePendingMatches(

    callback: (
        matchIds: string[],
    ) => void,

): () => void {

    const q = query(

        matchesCollection,

        where(
            "status",
            "==",
            "PENDING",
        ),

    );

    return onSnapshot(

        q,

        snapshot => {

            callback(

                snapshot.docs.map(
                    doc => doc.id,
                ),

            );

        },

    );

}