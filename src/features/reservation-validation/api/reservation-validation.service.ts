import {
    getPendingMatches,
} from "@/entities/match";

import {
    getReservation,
} from "@/entities/reservation";

import {
    getMatchPlanningContext,
} from "@/features/commands/match-planning.service";

import type {
    ReservationValidationItem,
} from "../model/reservation-validation-item";
import { getVenuesManagedByUser } from "@/entities/venue/venue.repository";

import type {
    Match,
} from "@/entities/match";



export async function loadPendingReservations(
    managerUserId: string,
): Promise<ReservationValidationItem[]> {

    const pendingMatches =
        await getPendingMatches();

    return buildPendingReservations(
        managerUserId,
        pendingMatches,
    );

}

export async function buildPendingReservations(

    managerUserId: string,

    pendingMatches: Match[],

): Promise<ReservationValidationItem[]> {

    const managedVenues =
        await getVenuesManagedByUser(
            managerUserId,
        );

    const managedVenueIds =
        managedVenues.map(
            venue => venue.id,
        );

    const result: ReservationValidationItem[] = [];

    for (const match of pendingMatches) {

        if (!match.plannedReservationId) {
            continue;
        }

        const [
            reservation,
            context,
        ] = await Promise.all([

            getReservation(
                match.plannedReservationId,
            ),

            getMatchPlanningContext(
                match.id,
            ),

        ]);

        if (!reservation) {
            continue;
        }

        /*
         * Le gérant ne voit que les réservations
         * de ses établissements.
         */
        if (
            !managedVenueIds.includes(
                context.venue.id,
            )
        ) {

            continue;

        }

        const reservationDate =
            reservation.plannedStartAt.toDate();

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0,
        );

        reservationDate.setHours(
            0,
            0,
            0,
            0,
        );

        const daysBeforeReservation =
            Math.floor(

                (
                    reservationDate.getTime()
                    -
                    today.getTime()
                )
                /
                86400000,

            );

        result.push({

            matchId:
                match.id,

            reservationId:
                reservation.id,

            matchDayNumber:
                context.matchDay.number,

            homeTeam:
                context.homeRegistration.registrationName,

            awayTeam:
                context.awayRegistration.registrationName,

            venueId:
                context.venue.id,

            venueName:
                context.venue.name,

            boardNumber:
                reservation.boardNumber,

            plannedStartAt:
                reservation.plannedStartAt,

            plannedEndAt:
                reservation.plannedEndAt,

            notes:
                reservation.notes,

            isHomeMatch:
                context.homeRegistration.homeVenueId
                ===
                context.venue.id,

            daysBeforeReservation,

        });

    }

    result.sort(
        (a, b) => {

            const date =
                a.plannedStartAt.toMillis()
                -
                b.plannedStartAt.toMillis();

            if (date !== 0) {
                return date;
            }

            return (
                a.boardNumber
                -
                b.boardNumber
            );

        },
    );

    return result;

}