import type {
    AvailabilityRuleType,
} from "@/entities/availability-rule";

export type ReservationSlotStatus =

    | "AVAILABLE"

    | "RESERVED"

    | "BLOCKED";

export interface ReservationSlot {

    boardNumber: number;

    startTime: string;

    endTime: string;

    status: ReservationSlotStatus;

    reservationId?: string;

    blockType?: AvailabilityRuleType;

    blockTitle?: string;

    blockDescription?: string;

}