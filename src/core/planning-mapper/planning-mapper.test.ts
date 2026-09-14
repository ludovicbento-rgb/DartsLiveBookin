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

                                    status: "AVAILABLE",

                                },

                                {

                                    boardNumber: 1,

                                    startTime: "19:30",

                                    endTime: "21:00",

                                    status: "RESERVED",

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

                                    status: "AVAILABLE",

                                },

                            ],

                        },

                    ],

                    availability: {

                        available: true,

                        planning: [],

                        reason: "OPEN",

                        rule: null,

                        closure: null,

                    },

                });

                expect(

                    planning.slots,

                ).toHaveLength(2);

                expect(

                    planning.slots[0].boards,

                ).toHaveLength(2);

            },

        );

        it(

            "should map AVAILABLE slot to AVAILABLE board",

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

                                    status: "AVAILABLE",

                                },

                            ],

                        },

                    ],

                    availability: {

                        available: true,

                        planning: [],

                        reason: "OPEN",

                        rule: null,

                        closure: null,

                    },

                });

                expect(

                    planning.slots[0]

                        .boards[0]

                        .status,

                ).toBe("AVAILABLE");

            },

        );

        it(

            "should map RESERVED slot to CONFIRMED board",

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

                                    status: "RESERVED",

                                },

                            ],

                        },

                    ],

                    availability: {

                        available: true,

                        planning: [],

                        reason: "OPEN",

                        rule: null,

                        closure: null,

                    },

                });

                expect(

                    planning.slots[0]

                        .boards[0]

                        .status,

                ).toBe("CONFIRMED");

            },

        );

        it(

            "should map BLOCKED slot to BLOCKED board",

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

                                    status: "BLOCKED",

                                    blockType: "EVENT",

                                    blockTitle: "Championnat",

                                    blockDescription: "Championnat régional",

                                },

                            ],

                        },

                    ],

                    availability: {

                        available: false,

                        planning: [],

                        reason: "RULE",

                        rule: null,

                        closure: null,

                    },

                });

                expect(

                    planning.slots[0]

                        .boards[0]

                        .status,

                ).toBe("BLOCKED");

                expect(

                    planning.slots[0]

                        .boards[0]

                        .label,

                ).toBe("Championnat");

            },

        );

    },

);