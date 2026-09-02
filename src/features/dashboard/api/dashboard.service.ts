import { getVenues } from "@/entities/venue";

import type { DashboardData } from "../model/dashboard.types";

import {
    getActiveSeason,
} from "@/entities/season";

export async function loadDashboard(): Promise<DashboardData> {

    const venues = await getVenues();

    const activeSeason =
        await getActiveSeason();

    return {
        venues,
        activeSeason,
    };

}