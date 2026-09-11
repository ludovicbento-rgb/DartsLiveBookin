import type {
    Timestamp,
} from "firebase/firestore";

export type UnavailableSlotType =

    | "EVENT"

    | "CLOSED"

    | "MAINTENANCE";

export interface UnavailableSlot {

    id: string;

    venueId: string;

    plannedStartAt: Timestamp;

    plannedEndAt: Timestamp;

    type: UnavailableSlotType;

    reason: string;

    createdByUserId: string;

    createdAt: Timestamp;

}