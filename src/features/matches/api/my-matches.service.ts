import {
    getRegistrationsByPlayer,
} from "@/entities/registration";

import {
    getMatchesByRegistration,
} from "@/entities/match";

import {
    getMatchPlanningContext,
} from "@/features/commands/match-planning.service";

import type {
    MyMatch,
} from "../model/my-match";

import {
    getReservation,
    getLastReservationByMatch,
} from "@/entities/reservation";

export async function loadMyMatches(
    playerId: string,
): Promise<MyMatch[]> {

    const registrations =
        await getRegistrationsByPlayer(
            playerId,
        );

    console.log(
        "Registrations trouvées :",
        registrations,
    );

    const result: MyMatch[] = [];

    for (const registration of registrations) {

        const matches =
            await getMatchesByRegistration(
                registration.id,
            );

        for (const match of matches) {

            const context =
                await getMatchPlanningContext(
                    match.id,
                );

            const reservation =

                match.plannedReservationId

                    ? await getReservation(

                        match.plannedReservationId,

                    )

                    : await getLastReservationByMatch(

                        match.id,

                    );

            result.push({

                matchId:
                    match.id,

                venueId:
                    context.venue.id,

                venueLogo:
                    context.venue.logo,

                reservationId:
                    reservation?.id ?? null,

                matchDayNumber:
                    context.matchDay.number,

                matchDayLabel:
                    `J${context.matchDay.number}`,

                homeTeam:
                    context.homeRegistration.registrationName,

                awayTeam:
                    context.awayRegistration.registrationName,

                venueName:
                    context.venue.name,

                boardNumber:
                    reservation?.boardNumber ?? null,

                plannedStartAt:
                    reservation?.plannedStartAt ?? null,

                plannedEndAt:
                    reservation?.plannedEndAt ?? null,

                status:
                    match.status,

                notes:
                    reservation?.notes ?? "",

                lastReservation:

                    reservation

                        ? {

                            id: reservation.id,

                            status: reservation.status,

                            validationComment:
                                reservation.validationComment,

                        }

                        : null,

            });

        }

    }

    return result.sort(

        (a, b) =>

            a.matchDayNumber -
            b.matchDayNumber,

    );

}