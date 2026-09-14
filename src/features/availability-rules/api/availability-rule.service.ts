import {
    getAvailabilityRulesByVenue,
} from "@/entities/availability-rule";

import {
    createAvailabilityRule,
    type CreateAvailabilityRuleInput,
} from "@/entities/availability-rule";

export async function loadAvailabilityRules(

    venueId: string,

) {

    return getAvailabilityRulesByVenue(

        venueId,

    );

}

export async function saveAvailabilityRule(

    input: CreateAvailabilityRuleInput,

) {

    return createAvailabilityRule(

        input,

    );

}