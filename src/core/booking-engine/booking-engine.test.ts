import {

    describe,

    expect,

    it,

} from "vitest";

import {

    findBestSlot,
    validateSelection,
    suggestAlternatives,

} from "./index";

import {
    buildPlanning,
} from "@/core/reservation-engine";

function createEmptyPlanning() {

    return buildPlanning(

        {

            openTime: "18:00",

            closeTime: "22:30",

            boardNumbers: [1, 2],

        },

        90,

        [],

    );

}

function createReservedPlanning() {

    return buildPlanning(

        {

            openTime: "18:00",

            closeTime: "22:30",

            boardNumbers: [1, 2],

        },

        90,

        [

            {

                boardNumber: 2,

                startTime: "18:00",

                endTime: "19:30",

            },

        ],

    );

}

describe(

    "BookingEngine",

    () => {

        it(

            "should return first free slot",

            () => {

                const suggestion =

                    findBestSlot({

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

                                ],

                            },

                        ],

                    });

                expect(

                    suggestion,

                ).not.toBeNull();

                expect(

                    suggestion?.boardNumber,

                ).toBe(1);

                expect(

                    suggestion?.slot.startTime,

                ).toBe("18:00");

            },

        );

        it(

            "should ignore reserved slots",

            () => {

                const suggestion =

                    findBestSlot({

                        planning: [

                            {

                                boardNumber: 1,

                                slots: [

                                    {

                                        boardNumber: 1,

                                        startTime: "18:00",

                                        endTime: "19:30",

                                        reserved: true,

                                    },

                                    {

                                        boardNumber: 1,

                                        startTime: "19:30",

                                        endTime: "21:00",

                                        reserved: false,

                                    },

                                ],

                            },

                        ],

                    });

                expect(

                    suggestion?.slot.startTime,

                ).toBe("19:30");

            },

        );

        it(

            "should search next board",

            () => {

                const suggestion =

                    findBestSlot({

                        planning: [

                            {

                                boardNumber: 1,

                                slots: [

                                    {

                                        boardNumber: 1,

                                        startTime: "18:00",

                                        endTime: "19:30",

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

                    suggestion?.boardNumber,

                ).toBe(2);

            },

        );

        it(

            "should return null when no slot exists",

            () => {

                const suggestion =

                    findBestSlot({

                        planning: [],

                    });

                expect(

                    suggestion,

                ).toBeNull();

            },

        );

        it(

            "should return null when every slot is reserved",

            () => {

                const suggestion =

                    findBestSlot({

                        planning: [

                            {

                                boardNumber: 1,

                                slots: [

                                    {

                                        boardNumber: 1,

                                        startTime: "18:00",

                                        endTime: "19:30",

                                        reserved: true,

                                    },

                                ],

                            },

                        ],

                    });

                expect(

                    suggestion,

                ).toBeNull();

            },

        );

        it(

            "should validate available slot",

            () => {

                const planning = createEmptyPlanning();

                const result =

                    validateSelection(

                        {

                            planning,

                        },

                        1,

                        "18:00",

                    );

                expect(

                    result.available,

                ).toBe(true);

            },

        );

        it(

            "should reject reserved slot",

            () => {

                const planning = createReservedPlanning();

                const result =

                    validateSelection(

                        {

                            planning,

                        },

                        2,

                        "18:00",

                    );

                expect(

                    result.available,

                ).toBe(false);

            },

        );

        it(

            "should return alternatives",

            () => {

                const planning = buildPlanning(

                    {

                        openTime: "18:00",

                        closeTime: "22:30",

                        boardNumbers: [1, 2],

                    },

                    90,

                    [],

                );
                const result =

                    suggestAlternatives({

                        planning,

                    });

                expect(

                    result.length,

                ).toBeGreaterThan(0);

            },

        );

    },

);