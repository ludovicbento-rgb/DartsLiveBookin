import {
    createMatch,
    getMatch,
    getMatchesByMatchDay,
    updateMatchParticipants,
} from "@/entities/match";

import type {
    Match,
} from "@/entities/match";

import type {
    AdminMatchRequest,
} from "../model/admin-match.types";

import {
    validateAdminMatch,
} from "./admin-match-validator";

export async function loadAdminMatches(
    matchDayId: string,
): Promise<Match[]> {

    if (!matchDayId) {

        return [];

    }

    return getMatchesByMatchDay(
        matchDayId,
    );

}

export async function createAdminMatch(
    request: AdminMatchRequest,
): Promise<string> {

    await validateAdminMatch(
        request,
    );

    return createMatch(
        request,
    );

}

export async function updateAdminMatch(

    matchId: string,

    request: AdminMatchRequest,

): Promise<void> {

    /*
     * ------------------------------------------------------------
     * Protection du workflow réservation
     * ------------------------------------------------------------
     */

    const match =
        await getMatch(
            matchId,
        );

    if (!match) {

        throw new Error(
            "MATCH_NOT_FOUND",
        );

    }

    if (
        match.status !==
        "NOT_PLANNED"
    ) {

        throw new Error(
            "MATCH_ALREADY_RESERVED",
        );

    }

    if (
        match.plannedReservationId !==
        null
    ) {

        throw new Error(
            "MATCH_ALREADY_RESERVED",
        );

    }

    /*
     * La journée du match reste immuable.
     */
    if (
        match.matchDayId !==
        request.matchDayId
    ) {

        throw new Error(
            "MATCHDAY_IMMUTABLE",
        );

    }

    await validateAdminMatch(
        request,
        matchId,
    );

    await updateMatchParticipants(

        matchId,

        {
            homeRegistrationId:
                request.homeRegistrationId,

            awayRegistrationId:
                request.awayRegistrationId,
        },

    );

}