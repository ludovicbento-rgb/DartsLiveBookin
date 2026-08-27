import type { VenuePlanning } from "../model/planning.types";

export const planningMock: VenuePlanning = {
    venueId: "point-bar",
    venueName: "Point Bar",
    boardCount: 2,
    slots: [
        {
            startTime: "18:00",
            endTime: "19:30",

            boards: [
                {
                    boardNumber: 1,
                    status: "AVAILABLE"
                },
                {
                    boardNumber: 2,
                    status: "CONFIRMED"
                },
            ],
        },

        {
            startTime: "19:30",
            endTime: "21:00",

            boards: [
                {
                    boardNumber: 1,
                    status: "AVAILABLE"
                },
                {
                    boardNumber: 2,
                    status: "AVAILABLE"
                },
            ],
        },

        {
            startTime: "21:00",
            endTime: "22:30",

            boards: [
                {
                    boardNumber: 1,
                    status: "PENDING"
                },
                {
                    boardNumber: 2,
                    status: "AVAILABLE"
                },
            ],
        },
    ],
};