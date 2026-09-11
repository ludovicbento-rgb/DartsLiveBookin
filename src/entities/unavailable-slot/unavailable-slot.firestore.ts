import {
    collection,
    doc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

export const unavailableSlotsCollection =

    collection(

        db,

        "unavailableSlots",

    );

export function unavailableSlotDocument(

    id: string,

) {

    return doc(

        unavailableSlotsCollection,

        id,

    );

}