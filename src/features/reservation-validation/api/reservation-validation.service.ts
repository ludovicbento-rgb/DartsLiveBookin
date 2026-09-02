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

export async function loadPendingReservations(
    managerUserId: string,
): Promise<ReservationValidationItem[]> {
    const managedVenues =
        await getVenuesManagedByUser(
            managerUserId,
        );

    const managedVenueIds =
        managedVenues.map(
            venue => venue.id,
        );
    const pendingMatches =
        await getPendingMatches();

    console.log(
        "Pending matches",
        pendingMatches,
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

        console.log(
            "Match",
            match.id,
            match.status,
            match.plannedReservationId,
        );
        if (!reservation) {
            continue;
        }

        /*
         * Un gérant ne voit que les réservations
         * de son établissement.
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

        today.setHours(0, 0, 0, 0);

        reservationDate.setHours(0, 0, 0, 0);

        const daysBeforeReservation =
            Math.floor(

                (

                    reservationDate.getTime() -

                    today.getTime()

                )

                / 86400000,

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

                context.homeRegistration.homeVenueId ===
                context.venue.id,

            daysBeforeReservation,

        });

    }

    result.sort((a, b) => {

        const date =
            a.plannedStartAt
                .toMillis() -
            b.plannedStartAt
                .toMillis();

        if (date !== 0) {
            return date;
        }

        return (
            a.boardNumber -
            b.boardNumber
        );

    });

    console.log(
        "Result",
        result,
    );

    return result;

}