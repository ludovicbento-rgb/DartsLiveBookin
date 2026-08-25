import type { DashboardData } from "../model/dashboard.types";

export const dashboardMock: DashboardData = {
    firstname: "Ludovic",

    season: "CF2027",

    competition: "Doublette",

    venues: [
        {
            id: "point-bar",
            name: "Point Bar",
            logo: "pointBar.jpg",
            boardCount: 2,
            availableSlots: 8,
            address: "17 Rue des Sergents",
            city: "Amiens",
            active: true,
        },
        {
            id: "murets-shop",
            name: "LesMurets.shop",
            logo: "MuretsShop.jpg",
            boardCount: 1,
            availableSlots: 3,
            address: "62 Rue Saint Leu",
            city: "Amiens",
            active: true,
        },
    ],
};