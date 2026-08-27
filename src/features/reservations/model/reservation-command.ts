import type { Timestamp } from "firebase/firestore";

export interface ReservationCommand {

    matchId: string;

    boardNumber: number;

    plannedStartAt: Timestamp;

    plannedEndAt: Timestamp;

    notes: string;

}