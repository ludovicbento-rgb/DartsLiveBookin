import {
    getActiveSeason,
} from "@/entities/season";

import {
    getVenuesManagedByUser,
} from "@/entities/venue/venue.repository";

import type {
    DashboardData,
} from "../model/dashboard.types";

export async function loadDashboard(
    managerUserId?: string,
): Promise<DashboardData> {

    const [
        activeSeason,
        managedVenues,
    ] = await Promise.all([

        getActiveSeason(),

        managerUserId
            ? getVenuesManagedByUser(
                managerUserId,
            )
            : Promise.resolve([]),

    ]);

    return {

        activeSeason,

        managedVenues,

    };

}