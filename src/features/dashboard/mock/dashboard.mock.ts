import type { DashboardData } from "../model/dashboard.types";

export const dashboardMock: DashboardData = {
    firstname: "Ludovic",

    season: "CF2027",

    competition: "Doublette",

    venues: [
        {
            id: "point-bar",
            name: "Point Bar",
            logoUrl: "/branding/logos/point-bar.png",
            boardCount: 2,
            availableSlots: 8,
        },
        {
            id: "lesmurets",
            name: "LesMurets.shop",
            logoUrl: "/branding/logos/lesmurets.png",
            boardCount: 1,
            availableSlots: 3,
        },
    ],
};