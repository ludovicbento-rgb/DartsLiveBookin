import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildAvailability,
    type AvailabilityInput,
} from "./index";

describe(
    "AvailabilityEngine",
    () => {

        const input: AvailabilityInput = {

            openingHours: {

                openTime: "18:00",

                closeTime: "22:30",

                boardNumbers: [1, 2],

            },

            durationMinutes: 90,

            reservations: [],

            closures: [



            ],

            rules: [],

            reservationDate: new Date(),

        };

        it(

            "should build planning when venue is open",

            () => {

                const availability =
                    buildAvailability(
                        input,
                    );

                expect(
                    availability.available,
                ).toBe(true);

                expect(
                    availability.reason,
                ).toBe("OPEN");

                expect(
                    availability.planning,
                ).toHaveLength(2);

                expect(
                    availability.rule,
                ).toBeNull();

                expect(
                    availability.closure,
                ).toBeNull();

            },

        );

        it(

            "should return closed decision when venue is closed",

            () => {

                const availability =
                    buildAvailability({

                        ...input,

                        closures: [

                            {

                                active: true,

                                startDate:
                                    new Date(),

                                endDate:
                                    new Date(),

                                reasonType:
                                    "VACATION",

                                comment:
                                    "Fermeture de Noël",

                            },

                        ],

                    });

                expect(
                    availability.available,
                ).toBe(false);

                expect(
                    availability.reason,
                ).toBe("CLOSURE");

                expect(
                    availability.planning,
                ).toEqual([]);

                expect(
                    availability.closure,
                ).not.toBeNull();

                expect(
                    availability.closure?.reasonType,
                ).toBe("VACATION");

                expect(
                    availability.closure?.comment,
                ).toBe("Fermeture de Noël");

            },

        );

        it(

            "should block every slot overlapping a weekly event",

            () => {

                const today =
                    new Date();

                const availability =
                    buildAvailability({

                        ...input,

                        rules: [

                            {

                                id: "RULE_1",

                                venueId: "VENUE",

                                title: "Championnat",

                                description: "Championnat régional",

                                type: "EVENT",

                                frequency: "WEEKLY",

                                weekDays: [

                                    today.getDay(),

                                ],

                                startTime: "20:00",

                                endTime: "00:00",

                                validFrom: "2026-01-01",
                                validTo: "2027-12-31",

                                isActive: true,

                                createdByUserId: "USER",

                                createdAt: {} as any,

                                updatedByUserId: null,

                                updatedAt: null,

                            },

                        ],

                    });

                expect(

                    availability.available,

                ).toBe(true);

                expect(

                    availability.reason,

                ).toBe("RULE");

                const board =
                    availability.planning[0];

                expect(

                    board.slots[0].status,

                ).toBe("AVAILABLE");

                expect(

                    board.slots[1].status,

                ).toBe("BLOCKED");

                expect(

                    board.slots[2].status,

                ).toBe("BLOCKED");

            },

        );

        it(

            "should keep every slot available without rule",

            () => {

                const availability =
                    buildAvailability(

                        input,

                    );

                expect(

                    availability.planning

                        .flatMap(

                            board => board.slots,

                        )

                        .every(

                            slot =>

                                slot.status === "AVAILABLE",

                        ),

                ).toBe(true);

            },

        );

        it(

            "should apply multiple rules",

            () => {

                const today =
                    new Date();

                const availability =
                    buildAvailability({

                        ...input,

                        rules: [

                            {

                                id: "RULE_1",

                                venueId: "VENUE",

                                title: "Début",

                                description: "",

                                type: "EVENT",

                                frequency: "WEEKLY",

                                weekDays: [

                                    today.getDay(),

                                ],

                                startTime: "18:00",

                                endTime: "19:30",

                                validFrom: "2026-01-01",
                                validTo: "2027-12-31",

                                isActive: true,

                                createdByUserId: "USER",

                                createdAt: {} as any,

                                updatedByUserId: null,

                                updatedAt: null,

                            },

                            {

                                id: "RULE_2",

                                venueId: "VENUE",

                                title: "Fin",

                                description: "",

                                type: "EVENT",

                                frequency: "WEEKLY",

                                weekDays: [

                                    today.getDay(),

                                ],

                                startTime: "21:00",

                                endTime: "22:30",

                                validFrom: "2026-01-01",
                                validTo: "2027-12-31",

                                isActive: true,

                                createdByUserId: "USER",

                                createdAt: {} as any,

                                updatedByUserId: null,

                                updatedAt: null,

                            },

                        ],

                    });

                const board =
                    availability.planning[0];

                expect(

                    board.slots[0].status,

                ).toBe("BLOCKED");

                expect(

                    board.slots[1].status,

                ).toBe("AVAILABLE");

                expect(

                    board.slots[2].status,

                ).toBe("BLOCKED");

            },

        );

        it(

            "should never overwrite a reserved slot",

            () => {

                const today =
                    new Date();

                const availability =
                    buildAvailability({

                        ...input,

                        reservations: [

                            {

                                boardNumber: 1,

                                startTime: "19:30",

                                endTime: "21:00",

                            },

                        ],

                        rules: [

                            {

                                id: "RULE",

                                venueId: "VENUE",

                                title: "Championnat",

                                description: "",

                                type: "EVENT",

                                frequency: "WEEKLY",

                                weekDays: [

                                    today.getDay(),

                                ],

                                startTime: "18:00",

                                endTime: "22:30",

                                validFrom: "2026-01-01",
                                validTo: "2027-12-31",

                                isActive: true,

                                createdByUserId: "USER",

                                createdAt: {} as any,

                                updatedByUserId: null,

                                updatedAt: null,

                            },

                        ],

                    });

                const board =
                    availability.planning[0];

                expect(

                    board.slots[1].status,

                ).toBe("RESERVED");

            },

        );

    },

);

