import {
    collection,
    doc,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

export const usersCollection =
    collection(db, "users");

export function userDocument(
    userId: string,
) {
    return doc(
        db,
        "users",
        userId,
    );
}