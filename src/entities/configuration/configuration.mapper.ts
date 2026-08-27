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

        reservationDuration:
            data.reservationDuration,

        reservationSlots:
            data.reservationSlots,

        maintenanceMode:
            data.maintenanceMode,

        version:
            data.version,

    };

}