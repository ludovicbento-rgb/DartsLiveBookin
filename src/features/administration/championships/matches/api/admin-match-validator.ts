import {
    getMatchDay,
} from "@/entities/matchday";

import {
    getRegistration,
} from "@/entities/registration";

import {
    getMatchesByMatchDay,
} from "@/entities/match";

import type {
    AdminMatchRequest,
} from "../model/admin-match.types";

export async function validateAdminMatch(

    request: AdminMatchRequest,

    currentMatchId?: string,

): Promise<void> {

    if (
        !request.matchDayId
        ||
        !request.homeRegistrationId
        ||
        !request.awayRegistrationId
    ) {

        throw new Error(
            "MATCH_REQUIRED_DATA",
        );

    }

    /*
     * ------------------------------------------------------------
     * Une inscription ne peut pas jouer contre elle-même
     * ------------------------------------------------------------
     */

    if (
        request.homeRegistrationId ===
        request.awayRegistrationId
    ) {

        throw new Error(
            "MATCH_SAME_REGISTRATION",
        );

    }

    /*
     * ------------------------------------------------------------
     * Journée
     * ------------------------------------------------------------
     */

    const matchDay =
        await getMatchDay(
            request.matchDayId,
        );

    if (!matchDay) {

        throw new Error(
            "MATCHDAY_NOT_FOUND",
        );

    }

    /*
     * ------------------------------------------------------------
     * Inscriptions
     * ------------------------------------------------------------
     */

    const [
        homeRegistration,
        awayRegistration,
    ] =
        await Promise.all([

            getRegistration(
                request.homeRegistrationId,
            ),

            getRegistration(
                request.awayRegistrationId,
            ),

        ]);

    if (
        !homeRegistration
        ||
        !awayRegistration
    ) {

        throw new Error(
            "MATCH_REGISTRATION_NOT_FOUND",
        );

    }

    /*
     * ------------------------------------------------------------
     * Les inscriptions doivent être actives
     * ------------------------------------------------------------
     */

    if (
        homeRegistration.active !== true
        ||
        awayRegistration.active !== true
    ) {

        throw new Error(
            "MATCH_REGISTRATION_INACTIVE",
        );

    }

    /*
     * ------------------------------------------------------------
     * Même compétition que la journée
     * ------------------------------------------------------------
     */

    if (
        homeRegistration.competitionId !==
        matchDay.competitionId
        ||
        awayRegistration.competitionId !==
        matchDay.competitionId
    ) {

        throw new Error(
            "MATCH_COMPETITION_MISMATCH",
        );

    }

    /*
     * ------------------------------------------------------------
     * Même poule que la journée
     * ------------------------------------------------------------
     */

    if (
        homeRegistration.poolId !==
        matchDay.poolId
        ||
        awayRegistration.poolId !==
        matchDay.poolId
    ) {

        throw new Error(
            "MATCH_POOL_MISMATCH",
        );

    }

    /*
     * ------------------------------------------------------------
     * Une inscription ne joue qu'une fois
     * dans une journée.
     * ------------------------------------------------------------
     */

    const matches =
        await getMatchesByMatchDay(
            request.matchDayId,
        );

    const conflict =
        matches.some(
            match => {

                /*
                 * En modification, le match lui-même
                 * est exclu du contrôle.
                 */
                if (
                    currentMatchId
                    &&
                    match.id ===
                    currentMatchId
                ) {

                    return false;

                }

                return (

                    match.homeRegistrationId ===
                    request.homeRegistrationId

                    ||

                    match.awayRegistrationId ===
                    request.homeRegistrationId

                    ||

                    match.homeRegistrationId ===
                    request.awayRegistrationId

                    ||

                    match.awayRegistrationId ===
                    request.awayRegistrationId

                );

            },
        );

    if (conflict) {

        throw new Error(
            "MATCH_REGISTRATION_ALREADY_PLAYING",
        );

    }

}