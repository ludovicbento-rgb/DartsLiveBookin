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

            closures: [],

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

                                startDate: new Date(),

                                endDate: new Date(),

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

            },

        );

        it(

            "should return rule decision when a weekly rule blocks the day",

            () => {

                const today =
                    new Date();

                const availability =
                    buildAvailability({

                        ...input,

                        rules: [

                            {

                                id: "RULE_1",

                                venueId: "VENUE_1",

                                title: "Championnat",

                                description: "",

                                type: "EVENT",

                                frequency: "WEEKLY",

                                weekDays: [

                                    today.getDay(),

                                ],

                                startTime: "18:00",

                                endTime: "22:30",

                                validFrom: {

                                    toDate: () => new Date("2026-01-01"),

                                } as any,

                                validTo: {

                                    toDate: () => new Date("2027-12-31"),

                                } as any,

                                isActive: true,

                                createdByUserId: "USR",

                                createdAt: {} as any,

                                updatedByUserId: null,

                                updatedAt: null,

                            },

                        ],

                    });

                expect(
                    availability.available,
                ).toBe(false);

                expect(
                    availability.reason,
                ).toBe("RULE");

                expect(
                    availability.rule,
                ).not.toBeNull();

                expect(
                    availability.planning,
                ).toEqual([]);

            },

        );

    },

);

