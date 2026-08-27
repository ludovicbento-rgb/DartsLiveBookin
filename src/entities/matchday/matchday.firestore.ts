import {
    collection,
    doc,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

export const matchDaysCollection =
    collection(
        db,
        "matchdays",
    );

export function matchDayDocument(
    matchDayId: string,
) {
    return doc(
        db,
        "matchdays",
        matchDayId,
    );
}