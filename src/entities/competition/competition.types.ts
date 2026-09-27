import type {
    Timestamp,
} from "firebase/firestore";

export type CompetitionMode =
    | "INDIVIDUAL"
    | "DOUBLES"
    | "TEAM";

export interface Competition {

    id: string;

    seasonId: string;

    name: string;

    mode: CompetitionMode;

    active: boolean;

    createdAt: Timestamp;

    updatedAt: Timestamp;

}