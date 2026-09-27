import {
    collection,
    doc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

export const competitionsCollection =
    collection(
        db,
        "competitions",
    );

export function competitionDocument(
    competitionId: string,
) {

    return doc(
        db,
        "competitions",
        competitionId,
    );

}