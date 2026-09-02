import { useState } from "react";

import type { Timestamp } from "firebase/firestore";

export interface ReservationSelection {

    matchId: string;

    venueId: string;

    venueName: string;

    reservationDate: Date;

    boardNumber: number;

    plannedStartAt: Timestamp;

    plannedEndAt: Timestamp;

    notes: string;

}

export function useReservationDialog() {

    const [
        selection,
        setSelection,
    ] =
        useState<ReservationSelection | null>(null);

    function open(
        selection: Omit<
            ReservationSelection,
            "matchId" | "notes"
        >,
    ) {

        setSelection({

            ...selection,

            matchId: "",

            notes: "",

        });

    }

    function close() {

        setSelection(null);

    }

    function updateMatch(
        matchId: string,
    ) {

        setSelection(current =>

            current
                ? {

                    ...current,

                    matchId,

                }
                : current,

        );

    }

    function updateNotes(
        notes: string,
    ) {

        setSelection(current =>

            current
                ? {

                    ...current,

                    notes,

                }
                : current,

        );

    }

    return {

        selection,

        opened:
            selection !== null,

        open,

        close,

        updateMatch,

        updateNotes,

    };

}