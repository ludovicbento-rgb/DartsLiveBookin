import {
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

import {
    matchesCollection,
} from "@/entities/match";

export function subscribePendingMatches(

    callback: () => void,

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

        () => {

            callback();

        },

    );

}