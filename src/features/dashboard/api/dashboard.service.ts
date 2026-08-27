import { getVenues } from "@/entities/venue";

import type { DashboardData } from "../model/dashboard.types";

export async function loadDashboard(): Promise<DashboardData> {

    const venues = await getVenues();

    return {
        venues,
    };

}