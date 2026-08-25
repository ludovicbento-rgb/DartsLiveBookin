export interface DashboardVenue {
    id: string;
    name: string;
    logoUrl: string;
    boardCount: number;
    availableSlots: number;
}

export interface DashboardData {
    firstname: string;
    season: string;
    competition: string;
    venues: DashboardVenue[];
}