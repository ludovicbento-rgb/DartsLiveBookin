import type {
    Timestamp,
} from "firebase/firestore";

export type AvailabilityRuleType =
    | "EVENT"
    | "CLOSED"
    | "MAINTENANCE";

export type AvailabilityFrequency =
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY";

export interface AvailabilityRule {

    id: string;

    venueId: string;

    title: string;

    description: string;

    type: AvailabilityRuleType;

    frequency: AvailabilityFrequency;

    weekDays: number[];

    startTime: string;

    endTime: string;

    validFrom: Timestamp;

    validTo: Timestamp;

    isActive: boolean;

    createdByUserId: string;

    createdAt: Timestamp;

    updatedByUserId: string | null;

    updatedAt: Timestamp | null;

}