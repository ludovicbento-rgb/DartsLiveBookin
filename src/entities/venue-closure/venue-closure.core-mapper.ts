import type {
    AvailabilityClosure,
} from "@/core/availability-engine";

import type {
    VenueClosure,
} from "./venue-closure.types";

export function mapAvailabilityClosure(

    closure: VenueClosure,

): AvailabilityClosure {

    return {

        active:
            closure.active,

        startDate:
            closure.startDate.toDate(),

        endDate:
            closure.endDate.toDate(),

    };

}