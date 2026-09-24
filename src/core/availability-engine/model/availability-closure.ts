import type {
    VenueClosureReason,
} from "@/entities/venue-closure";

export interface AvailabilityClosure {

    active: boolean;

    startDate: Date;

    endDate: Date;

    reasonType: VenueClosureReason;

    comment: string;

}