export interface DashboardVenue {
    id: string;
    name: string;
    logo: string;
    boardCount: number;
    availableSlots: number;
    city: string;
    address: string;
    active: boolean;
}

export interface DashboardData {
    firstname: string;
    season: string;
    competition: string;
    venues: DashboardVenue[];
}