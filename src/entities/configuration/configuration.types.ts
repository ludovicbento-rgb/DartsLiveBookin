import type {
    Timestamp,
} from "firebase/firestore";

export interface Configuration {

    applicationName: string;

    currentSeasonId: string;

    maintenanceMode: boolean;

    maintenanceMessage:
    string | null;

    maintenanceStartedAt:
    Timestamp | null;

    maintenanceStartedBy:
    string | null;

    version: string;

}