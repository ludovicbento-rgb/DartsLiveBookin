import type { Timestamp } from "firebase/firestore";

export interface Season {

    id: string;

    name: string;

    active: boolean;

    createdAt: Timestamp;

    updatedAt: Timestamp;

}