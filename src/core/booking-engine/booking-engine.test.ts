import {

    describe,

    expect,

    it,

} from "vitest";

import {

    findBestSlot,

} from "./index";

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

    },

);