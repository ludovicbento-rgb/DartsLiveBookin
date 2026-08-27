import type { Timestamp } from "firebase/firestore";

export interface MatchSelection {

    matchId: string;

    boardNumber: number;

    plannedStartAt: Timestamp;

    plannedEndAt: Timestamp;

    notes: string;

}