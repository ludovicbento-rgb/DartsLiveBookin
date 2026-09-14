import {
    getAvailabilityRulesByVenue,
} from "@/entities/availability-rule";

export async function loadAvailabilityRules(

    venueId: string,

) {

    return getAvailabilityRulesByVenue(

        venueId,

    );

}