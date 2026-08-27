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
} from "@/entities/reservation";

export async function loadMyMatches(
    playerUid: string,
): Promise<MyMatch[]> {

    const registrations =
        await getRegistrationsByPlayer(
            playerUid,
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

                    : null;

            result.push({

                matchId:
                    match.id,

                reservationId:
                    reservation?.id ?? null,

                matchDay:
                    context.matchDay.displayName,

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

            });

        }

    }

    return result.sort(

        (a, b) =>

            a.matchDay.localeCompare(
                b.matchDay,
            ),

    );

}