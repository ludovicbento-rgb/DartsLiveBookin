import type {
    Timestamp,
} from "firebase/firestore";

export type VenueClosureReason =

    | "VACATION"

    | "PRIVATE_EVENT"

    | "MAINTENANCE"

    | "INVENTORY"

    | "OTHER";

export interface VenueClosure {

    id: string;

    venueId: string;

    startDate: Timestamp;

    endDate: Timestamp;

    reasonType: VenueClosureReason;

    comment: string;

    active: boolean;

}