import {
    collection,
    doc,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

export const registrationsCollection =
    collection(
        db,
        "registrations",
    );

export function registrationDocument(
    registrationId: string,
) {
    return doc(
        db,
        "registrations",
        registrationId,
    );
}