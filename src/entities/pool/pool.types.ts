import type {
    Timestamp,
} from "firebase/firestore";

export interface Pool {

    id: string;

    competitionId: string;

    name: string;

    order: number;

    active: boolean;

    createdAt: Timestamp;

    updatedAt: Timestamp;

}