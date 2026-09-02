import {
    describe,
    expect,
    it,
} from "vitest";

import {
    mapPlanning,
} from "./index";

describe(

    "PlanningMapper",

    () => {

        it(

            "should convert PlanningBoard[] into Planning",

            () => {

                const planning = mapPlanning({

                    venueId: "murets",

                    venueName: "Les Murets",

                    planning: [

                        {

                            boardNumber: 1,

                            slots: [

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

                                    reserved: true,

                                },

                            ],

                        },

                        {

                            boardNumber: 2,

                            slots: [

                                {

                                    boardNumber: 2,

                                    startTime: "18:00",

                                    endTime: "19:30",

                                    reserved: false,

                                },

                            ],

                        },

                    ],

                });

                expect(

                    planning.slots,

                ).toHaveLength(2);

                expect(

                    planning.slots[0].boards,

                ).toHaveLength(2);

            },

        );

    },

);