import {
    collection,
    doc,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

export const seasonsCollection =
    collection(
        db,
        "seasons",
    );

export function seasonDocument(
    seasonId: string,
) {

    return doc(
        seasonsCollection,
        seasonId,
    );

}