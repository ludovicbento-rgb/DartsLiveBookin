import {
    collection,
    doc,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

export const matchesCollection =
    collection(
        db,
        "matches",
    );

export function matchDocument(
    matchId: string,
) {
    return doc(
        db,
        "matches",
        matchId,
    );
}