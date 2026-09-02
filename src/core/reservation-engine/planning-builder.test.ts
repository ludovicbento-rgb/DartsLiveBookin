import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildPlanning,
} from "./planning-builder";

import type {
    OpeningHours,
} from "./model/opening-hours";

import type {
    Reservation,
} from "./model/reservation";

describe("ReservationEngine", () => {

    const openingHours: OpeningHours = {

        openTime: "18:00",

        closeTime: "22:30",

        boardNumbers: [1, 2],

    };

    it("should build one planning board per target", () => {

        const planning = buildPlanning(

            openingHours,

            90,

            [],

        );

        expect(planning).toHaveLength(2);

    });

    it("should build three slots on first board", () => {

        const planning = buildPlanning(

            openingHours,

            90,

            [],

        );

        expect(planning[0].slots).toHaveLength(3);

    });

    it("should mark one slot as reserved", () => {

        const reservations: Reservation[] = [

            {

                boardNumber: 1,

                startTime: "19:30",

                endTime: "21:00",

            },

        ];

        const planning = buildPlanning(

            openingHours,

            90,

            reservations,

        );

        expect(

            planning[0]

                .slots[1]

                .reserved,

        ).toBe(true);

    });

    it("should not reserve slots on another board", () => {

        const reservations: Reservation[] = [

            {

                boardNumber: 2,

                startTime: "19:30",

                endTime: "21:00",

            },

        ];

        const planning = buildPlanning(

            openingHours,

            90,

            reservations,

        );

        expect(

            planning[0]

                .slots[1]

                .reserved,

        ).toBe(false);

    });

    it("should keep free slots available", () => {

        const planning = buildPlanning(

            openingHours,

            90,

            [],

        );

        expect(

            planning

                .flatMap(

                    board => board.slots,

                )

                .every(

                    slot => !slot.reserved,

                ),

        ).toBe(true);

    });

});