import type {
    Timestamp,
} from "firebase/firestore";

export interface Registration {

    id: string;

    seasonId: string;

    competitionId: string;

    poolId: string;

    registrationName: string;

    captainId: string;

    playerIds: string[];

    /**
     * Etablissement où cette inscription reçoit
     * ses matchs à domicile.
     */
    homeVenueId: string;

    active: boolean;

    createdAt?: Timestamp;

    updatedAt?: Timestamp;

}   