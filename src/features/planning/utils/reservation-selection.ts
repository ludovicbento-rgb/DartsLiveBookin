import {
    Timestamp,
} from "firebase/firestore";

import type {
    BoardSlot,
    TimeSlot,
} from "../model/planning.types";

interface Params {

    venueId: string;

    venueName: string;

    reservationDate: Date;

    slot: TimeSlot;

    board: BoardSlot;

}

export function buildReservationSelection({

    venueId,

    venueName,

    reservationDate,

    slot,

    board,

}: Params) {

    const [

        startHour,

        startMinute,

    ] = slot.startTime
        .split(":")
        .map(Number);

    const [

        endHour,

        endMinute,

    ] = slot.endTime
        .split(":")
        .map(Number);

    const start =

        new Date(
            reservationDate,
        );

    start.setHours(
        startHour,
        startMinute,
        0,
        0,
    );

    const end =

        new Date(
            reservationDate,
        );

    end.setHours(
        endHour,
        endMinute,
        0,
        0,
    );

    return {

        reservationDate,

        venueId,

        venueName,

        boardNumber:
            board.boardNumber,

        plannedStartAt:
            Timestamp.fromDate(start),

        plannedEndAt:
            Timestamp.fromDate(end),

    };

}   