import {
    describe,
    expect,
    it,
} from "vitest";

import {
    Timestamp,
} from "firebase/firestore";

import {
    getReservationPermissions,
} from "./reservation-permissions.service";

function buildReservation(

    status:

        | "PENDING"

        | "CONFIRMED"

        | "REJECTED"

        | "CANCELLED",

    offsetHours: number,

) {

    return {

        id: "1",

        matchId: "MATCH",

        venueId: "Venue-1",

        boardNumber: 1,

        plannedStartAt:

            Timestamp.fromDate(

                new Date(

                    Date.now()

                    + offsetHours * 3600000,

                ),

            ),

        plannedEndAt:

            Timestamp.fromDate(

                new Date(

                    Date.now()

                    + (offsetHours + 2) * 3600000,

                ),

            ),

        status,

        createdByUserId: "",

        createdAt:

            Timestamp.now(),

        validatedByUserId: null,

        validatedAt: null,

        rejectedByUserId: null,

        rejectedAt: null,

        cancelledByUserId: null,

        cancelledAt: null,

        validationComment: "",

        notes: "",

    };

}

describe(

    "ReservationPermissions",

    () => {

        it(

            "should allow cancellation",

            () => {

                const permissions =

                    getReservationPermissions({

                        reservation:

                            buildReservation(

                                "PENDING",

                                2,

                            ),

                        isPlayerOfMatch: true,

                    });

                expect(

                    permissions.canCancel,

                ).toBe(true);

            },

        );

        it(

            "should reject past reservation",

            () => {

                const permissions =

                    getReservationPermissions({

                        reservation:

                            buildReservation(

                                "PENDING",

                                -2,

                            ),

                        isPlayerOfMatch: true,

                    });

                expect(

                    permissions.canCancel,

                ).toBe(false);

            },

        );

        it(

            "should reject cancelled reservation",

            () => {

                const permissions =

                    getReservationPermissions({

                        reservation:

                            buildReservation(

                                "CANCELLED",

                                2,

                            ),

                        isPlayerOfMatch: true,

                    });

                expect(

                    permissions.canCancel,

                ).toBe(false);

            },

        );

        it(

            "should reject foreign player",

            () => {

                const permissions =

                    getReservationPermissions({

                        reservation:

                            buildReservation(

                                "PENDING",

                                2,

                            ),

                        isPlayerOfMatch: false,

                    });

                expect(

                    permissions.canCancel,

                ).toBe(false);

            },

        );

    },

);