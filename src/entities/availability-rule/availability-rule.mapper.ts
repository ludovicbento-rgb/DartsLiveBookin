import type {
    QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
    AvailabilityRule,
} from "./availability-rule.types";

export function mapAvailabilityRule(
    snapshot: QueryDocumentSnapshot,
): AvailabilityRule {

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            AvailabilityRule,
            "id"
        >),

    };

}