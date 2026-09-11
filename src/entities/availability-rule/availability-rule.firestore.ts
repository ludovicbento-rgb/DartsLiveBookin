import {
    collection,
    doc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

export const availabilityRulesCollection =
    collection(
        db,
        "availabilityRules",
    );

export function availabilityRuleDocument(
    id: string,
) {

    return doc(
        availabilityRulesCollection,
        id,
    );

}