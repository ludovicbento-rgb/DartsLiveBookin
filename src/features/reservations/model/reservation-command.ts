import type { Timestamp } from "firebase/firestore";

export interface ReservationCommand {

    matchId: string;

    venueId: string;

    boardNumber: number;

    plannedStartAt: Timestamp;

    plannedEndAt: Timestamp;

    notes: string;

}