import type {
    Venue,
} from "@/entities/venue";

import type {
    Season,
} from "@/entities/season";

export interface DashboardData {

    activeSeason:
    Season | null;

    managedVenues:
    Venue[];

}