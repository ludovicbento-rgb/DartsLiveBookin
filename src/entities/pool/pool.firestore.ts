import {
    collection,
    doc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

export const poolsCollection =
    collection(
        db,
        "pools",
    );

export function poolDocument(
    poolId: string,
) {

    return doc(
        db,
        "pools",
        poolId,
    );

}