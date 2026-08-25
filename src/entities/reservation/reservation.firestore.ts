import {
    collection,
    doc,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

export const reservationsCollection =
    collection(db, "reservations");

export function reservationDocument(
    reservationId: string,
) {
    return doc(
        db,
        "reservations",
        reservationId,
    );
}