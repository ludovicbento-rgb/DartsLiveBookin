import type {
    Timestamp,
} from "firebase/firestore";

export type CompetitionType =
    | "INDIVIDUAL"
    | "DOUBLES"
    | "TEAM";

export interface Competition {

    id: string;

    seasonId: string;

    name: string;

    type: CompetitionType;

    active: boolean;

    matchDurationMinutes?: number | string;

    createdAt?: Timestamp;

    updatedAt?: Timestamp;

}