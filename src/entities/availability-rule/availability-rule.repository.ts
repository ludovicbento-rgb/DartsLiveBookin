import {
    getDocs,
    query,
    where,
} from "firebase/firestore";

import {
    availabilityRulesCollection,
} from "./availability-rule.firestore";

import {
    mapAvailabilityRule,
} from "./availability-rule.mapper";

import type {
    AvailabilityRule,
} from "./availability-rule.types";

export async function getAvailabilityRulesByVenue(

    venueId: string,

): Promise<AvailabilityRule[]> {

    const q = query(

        availabilityRulesCollection,

        where(
            "venueId",
            "==",
            venueId,
        ),

        where(
            "isActive",
            "==",
            true,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapAvailabilityRule,
    );

}

export async function getActiveAvailabilityRulesByVenue(

    venueId: string,

): Promise<AvailabilityRule[]> {

    return getAvailabilityRulesByVenue(

        venueId,

    );

}