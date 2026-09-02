import type {
    Timestamp,
} from "firebase/firestore";

export interface Venue {

    id: string;

    name: string;

    city: string;

    address: string;

    boardCount: number;

    logo: string | null;

    active: boolean;

    managerUserIds: string[];

    createdAt?: Timestamp;

    updatedAt?: Timestamp;

}