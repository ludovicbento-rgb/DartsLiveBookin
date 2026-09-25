import type {
    Reservation,
} from "@/entities/reservation";

import {
    getVenuesManagedByUser,
} from "@/entities/venue/venue.repository";

import {
    getMatchPlanningContext,
} from "@/features/commands/match-planning.service";

import type {
    AgendaItem,
} from "../model/agenda-item";

export async function buildManagerAgenda(

    managerUserId: string,

    reservations: Reservation[],

): Promise<AgendaItem[]> {

    /*
     * ------------------------------------------------------------
     * Établissements gérés
     * ------------------------------------------------------------
     */

    const managedVenues =
        await getVenuesManagedByUser(
            managerUserId,
        );

    const managedVenueIds =
        new Set(

            managedVenues.map(
                venue => venue.id,
            ),

        );

    if (
        managedVenueIds.size === 0
    ) {

        return [];

    }

    /*
     * ------------------------------------------------------------
     * Début de la journée courante
     * ------------------------------------------------------------
     *
     * On conserve les réservations d'aujourd'hui,
     * même si leur créneau est déjà commencé.
     */

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0,
    );

    /*
     * ------------------------------------------------------------
     * Réservations pertinentes
     * ------------------------------------------------------------
     */

    const relevantReservations =
        reservations.filter(

            reservation =>

                reservation.status ===
                "CONFIRMED"

                &&

                managedVenueIds.has(
                    reservation.venueId,
                )

                &&

                reservation.plannedStartAt
                    .toDate()
                    .getTime()
                >=
                today.getTime(),

        );

    /*
     * ------------------------------------------------------------
     * Construction des items Agenda
     * ------------------------------------------------------------
     */

    const items =
        await Promise.all(

            relevantReservations.map(

                async reservation => {

                    const context =
                        await getMatchPlanningContext(
                            reservation.matchId,
                        );

                    const venue =
                        managedVenues.find(
                            venue =>
                                venue.id ===
                                reservation.venueId,
                        );

                    if (!venue) {

                        return null;

                    }

                    const item: AgendaItem = {

                        reservationId:
                            reservation.id,

                        matchId:
                            reservation.matchId,

                        venueId:
                            reservation.venueId,

                        venueName:
                            venue.name,

                        matchDayNumber:
                            context.matchDay.number,

                        homeTeam:
                            context.homeRegistration
                                .registrationName,

                        awayTeam:
                            context.awayRegistration
                                .registrationName,

                        boardNumber:
                            reservation.boardNumber,

                        plannedStartAt:
                            reservation.plannedStartAt,

                        plannedEndAt:
                            reservation.plannedEndAt,

                        notes:
                            reservation.notes,

                    };

                    return item;

                },

            ),

        );

    /*
     * ------------------------------------------------------------
     * Suppression des éventuels null + tri
     * ------------------------------------------------------------
     */

    return items

        .filter(
            (
                item,
            ): item is AgendaItem =>
                item !== null,
        )

        .sort(
            (a, b) => {

                const dateDifference =
                    a.plannedStartAt.toMillis()
                    -
                    b.plannedStartAt.toMillis();

                if (
                    dateDifference !== 0
                ) {

                    return dateDifference;

                }

                return (
                    a.boardNumber
                    -
                    b.boardNumber
                );

            },
        );

}