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

            reservationDate: new Date(),

        };

        it(

            "should build planning when venue is open",

            () => {

                const planning =

                    buildAvailability(

                        input,

                    );

                expect(

                    planning,

                ).toHaveLength(2);

            },

        );

        it(

            "should return empty planning when venue is closed",

            () => {

                const planning =

                    buildAvailability({

                        ...input,

                        closures: [

                            {

                                active: true,

                                startDate: new Date(),

                                endDate: new Date(),

                            }

                        ]

                    });

                expect(

                    planning,

                ).toEqual([]);

            },

        );

    },

);