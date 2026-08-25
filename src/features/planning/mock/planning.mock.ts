import type { VenuePlanning } from "../model/planning.types";

export const planningMock: VenuePlanning = {
    venueId: "point-bar",
    venueName: "Point Bar",

    slots: [
        {
            id: "18h00",
            startTime: "18:00",
            endTime: "19:30",

            boards: [
                {
                    boardNumber: 1,
                    available: true,
                },
                {
                    boardNumber: 2,
                    available: false,
                },
            ],
        },

        {
            id: "19h30",
            startTime: "19:30",
            endTime: "21:00",

            boards: [
                {
                    boardNumber: 1,
                    available: true,
                },
                {
                    boardNumber: 2,
                    available: true,
                },
            ],
        },

        {
            id: "21h00",
            startTime: "21:00",
            endTime: "22:30",

            boards: [
                {
                    boardNumber: 1,
                    available: false,
                },
                {
                    boardNumber: 2,
                    available: true,
                },
            ],
        },
    ],
};