import { useEffect, useState } from "react";

import type { VenuePlanning } from "../model/planning.types";

import {
    getReservationsByVenueAndDay,
} from "@/entities/reservation";

import { buildPlanning } from "../utils/buildPlanning";

const slots = [
    {
        startTime: "18:00",
        endTime: "19:30",
    },
    {
        startTime: "19:30",
        endTime: "21:00",
    },
    {
        startTime: "21:00",
        endTime: "22:30",
    },
];

export function usePlanning(
    venueId: string,
) {
    const [planning, setPlanning] =
        useState<VenuePlanning | null>(null);

    useEffect(() => {

        async function load() {

            const reservations =
                await getReservationsByVenueAndDay(
                    venueId,
                    new Date(),
                );

            const result =
                buildPlanning(
                    venueId,
                    "Point Bar",
                    2,
                    slots,
                    reservations,
                );

            setPlanning(result);

        }

        load();

    }, [venueId]);

    return planning;
}