import {
    collection,
    doc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

export const venueClosuresCollection =

    collection(
        db,
        "venue-closures",
    );

export function venueClosureDocument(
    closureId: string,
) {

    return doc(
        db,
        "venue-closures",
        closureId,
    );

}           