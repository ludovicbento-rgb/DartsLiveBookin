import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildReservationSlots,
    type OpeningHours,
} from "./index";

describe("ReservationSlotBuilder", () => {

    const openingHours: OpeningHours = {

        openTime: "18:00",

        closeTime: "22:30",

        boardNumbers: [1],

    };

    it("should build three doubles slots", () => {

        const slots = buildReservationSlots(

            openingHours,

            90,

        );

        expect(slots).toEqual([

            {
                boardNumber: 1,
                startTime: "18:00",
                endTime: "19:30",
                reserved: false,
            },

            {
                boardNumber: 1,
                startTime: "19:30",
                endTime: "21:00",
                reserved: false,
            },

            {
                boardNumber: 1,
                startTime: "21:00",
                endTime: "22:30",
                reserved: false,
            },

        ]);

    });

    it("should build six individual slots", () => {

        const slots = buildReservationSlots(

            openingHours,

            45,

        );

        expect(slots).toHaveLength(6);

        expect(slots[0].startTime).toBe("18:00");

        expect(slots[5].endTime).toBe("22:30");

    });

    it("should build one team slot", () => {

        const slots = buildReservationSlots(

            openingHours,

            150,

        );

        expect(slots).toHaveLength(1);

        expect(slots[0].startTime).toBe("18:00");

        expect(slots[0].endTime).toBe("20:30");

    });

    it("should return empty array if duration is bigger than opening", () => {

        const slots = buildReservationSlots(

            {

                openTime: "18:00",

                closeTime: "19:00",

                boardNumbers: [1],

            },

            90,

        );

        expect(slots).toEqual([]);

    });

    it("should generate slots for every board", () => {

        const slots = buildReservationSlots(

            {

                openTime: "18:00",

                closeTime: "22:30",

                boardNumbers: [1, 2],

            },

            90,

        );

        expect(slots).toHaveLength(6);

    });

});