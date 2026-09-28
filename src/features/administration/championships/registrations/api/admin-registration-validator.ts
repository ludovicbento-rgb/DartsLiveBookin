import type {
    CompetitionType,
} from "@/entities/competition";

import type {
    AdminRegistrationRequest,
} from "../model/admin-registration.types";

export function validateAdminRegistration(

    request: AdminRegistrationRequest,

    competitionMode: CompetitionType,

): void {

    if (
        request.seasonId.trim() === ""
    ) {

        throw new Error(
            "REGISTRATION_SEASON_REQUIRED",
        );

    }

    if (
        request.competitionId.trim() === ""
    ) {

        throw new Error(
            "REGISTRATION_COMPETITION_REQUIRED",
        );

    }

    if (
        request.poolId.trim() === ""
    ) {

        throw new Error(
            "REGISTRATION_POOL_REQUIRED",
        );

    }

    if (
        request.registrationName.trim() === ""
    ) {

        throw new Error(
            "REGISTRATION_NAME_REQUIRED",
        );

    }

    if (
        request.homeVenueId.trim() === ""
    ) {

        throw new Error(
            "REGISTRATION_VENUE_REQUIRED",
        );

    }

    /*
     * ------------------------------------------------------------
     * Suppression des doublons joueurs
     * ------------------------------------------------------------
     */

    const uniquePlayerIds =
        new Set(
            request.playerIds,
        );

    if (
        uniquePlayerIds.size
        !==
        request.playerIds.length
    ) {

        throw new Error(
            "REGISTRATION_DUPLICATE_PLAYER",
        );

    }

    /*
     * ------------------------------------------------------------
     * Capitaine
     * ------------------------------------------------------------
     *
     * Règle métier :
     * le capitaine joue toujours.
     */

    if (
        !request.captainId
        ||
        !uniquePlayerIds.has(
            request.captainId,
        )
    ) {

        throw new Error(
            "REGISTRATION_CAPTAIN_MUST_PLAY",
        );

    }

    /*
     * ------------------------------------------------------------
     * Composition
     * ------------------------------------------------------------
     */

    switch (
    competitionMode
    ) {

        case "INDIVIDUAL":

            if (
                request.playerIds.length !== 1
            ) {

                throw new Error(
                    "REGISTRATION_INDIVIDUAL_PLAYER_COUNT",
                );

            }

            break;


        case "DOUBLES":

            if (
                request.playerIds.length < 2
                ||
                request.playerIds.length > 3
            ) {

                throw new Error(
                    "REGISTRATION_DOUBLES_PLAYER_COUNT",
                );

            }

            break;


        case "TEAM":

            if (
                request.playerIds.length < 4
                ||
                request.playerIds.length > 6
            ) {

                throw new Error(
                    "REGISTRATION_TEAM_PLAYER_COUNT",
                );

            }

            break;

    }

}