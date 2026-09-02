import type { Venue } from "@/entities/venue";
import type {
    Season,
} from "@/entities/season";


export interface DashboardData {
    venues: Venue[];
    activeSeason: Season | null;
}