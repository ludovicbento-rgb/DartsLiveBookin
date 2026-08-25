import {
    collection,
    doc,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

export const venuesCollection =
    collection(db, "venues");

export function venueDocument(
    venueId: string,
) {
    return doc(
        db,
        "venues",
        venueId,
    );
}