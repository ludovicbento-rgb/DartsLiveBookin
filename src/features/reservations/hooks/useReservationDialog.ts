import { useState } from "react";

import type { Timestamp } from "firebase/firestore";

export interface ReservationSelection {

    venueId: string;

    venueName: string;

    boardNumber: number;

    startAt: Timestamp;

    endAt: Timestamp;

}

export function useReservationDialog() {
    const [selection, setSelection] =
        useState<ReservationSelection | null>(null);

    function open(selection: ReservationSelection) {
        setSelection(selection);
    }

    function close() {
        setSelection(null);
    }

    return {
        selection,
        opened: selection !== null,
        open,
        close,
    };
}