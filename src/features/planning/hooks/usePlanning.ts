import { useEffect, useState } from "react";

import type { VenuePlanning } from "../model/planning.types";
import type { Reservation } from "@/entities/reservation";

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

            try {
                // TODO US-004
                // Remplacer les réservations simulées
                // par la lecture Firestore.
                const reservations: Reservation[] = [];

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
            catch (e) {

                console.error(
                    "Erreur Planning",
                    e,
                );

                // Pour continuer la recette
                // on affiche quand même le planning vide

                setPlanning(

                    buildPlanning(
                        venueId,
                        "Point Bar",
                        2,
                        slots,
                        [],
                    ),

                );

            }

        }

        load();

    }, [venueId]);

    return planning;

}