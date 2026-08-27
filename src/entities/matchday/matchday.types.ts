import type { Timestamp } from "firebase/firestore";

export interface MatchDay {

    id: string;

    seasonId: string;

    competitionId: string;

    poolId: string;

    number: number;

    displayName: string;

    officialDate: Timestamp;

    active: boolean;

}