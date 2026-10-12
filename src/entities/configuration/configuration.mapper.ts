import type {
    DocumentSnapshot,
} from "firebase/firestore";

import type {
    Configuration,
} from "./configuration.types";

export function mapConfiguration(
    snapshot: DocumentSnapshot,
): Configuration {

    const data =
        snapshot.data() as Configuration;

    return {

        applicationName:
            data.applicationName,

        currentSeasonId:
            data.currentSeasonId,

        maintenanceMode:
            data.maintenanceMode,

        version:
            data.version,

        maintenanceMessage:
            typeof data.maintenanceMessage === "string"
                ? data.maintenanceMessage
                : null,

        maintenanceStartedAt:
            data.maintenanceStartedAt
            ??
            null,

        maintenanceStartedBy:
            typeof data.maintenanceStartedBy === "string"
                ? data.maintenanceStartedBy
                : null,

    };

}       