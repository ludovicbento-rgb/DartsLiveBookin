import type {
    Timestamp,
} from "firebase/firestore";

export interface AdminMatchDayRequest {

    seasonId: string;

    competitionId: string;

    poolId: string;

    number: number;

    displayName: string;

    officialDate: Timestamp;

    active: boolean;

}