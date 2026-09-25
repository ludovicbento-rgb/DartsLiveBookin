import {
    doc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

export function userAuthDocument(
    firebaseUid: string,
) {

    return doc(
        db,
        "user-auth",
        firebaseUid,
    );

}