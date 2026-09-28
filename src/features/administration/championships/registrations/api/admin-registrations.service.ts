import {
    createRegistration,
    getRegistrationsByCompetition,
    updateRegistration,
} from "@/entities/registration";

import {
    getCompetition,
} from "@/entities/competition";

import type {
    Registration,
} from "@/entities/registration";

import type {
    AdminRegistrationRequest,
} from "../model/admin-registration.types";

import {
    validateAdminRegistration,
} from "./admin-registration-validator";

import {
    getPool,
} from "@/entities/pool";

export async function loadAdminRegistrations(

    competitionId: string,

    poolId: string,

): Promise<Registration[]> {

    if (
        !competitionId
        ||
        !poolId
    ) {

        return [];

    }

    const registrations =
        await getRegistrationsByCompetition(
            competitionId,
            poolId,
        );

    return [...registrations].sort(
        (a, b) =>
            a.registrationName.localeCompare(
                b.registrationName,
                "fr",
            ),
    );

}

async function validateRequest(
    request: AdminRegistrationRequest,
): Promise<void> {

    const competition =
        await getCompetition(
            request.competitionId,
        );

    if (!competition) {

        throw new Error(
            "REGISTRATION_COMPETITION_NOT_FOUND",
        );

    }

    const pool =
        await getPool(
            request.poolId,
        );

    if (!pool) {

        throw new Error(
            "REGISTRATION_POOL_NOT_FOUND",
        );

    }

    if (
        pool.competitionId
        !==
        competition.id
    ) {

        throw new Error(
            "REGISTRATION_POOL_MISMATCH",
        );

    }

    /*
     * Protection supplémentaire :
     * la compétition doit appartenir
     * à la saison sélectionnée.
     */

    if (
        competition.seasonId
        !==
        request.seasonId
    ) {

        throw new Error(
            "REGISTRATION_SEASON_MISMATCH",
        );

    }

    validateAdminRegistration(
        request,
        competition.type,
    );

}

export async function createAdminRegistration(
    request: AdminRegistrationRequest,
): Promise<string> {

    await validateRequest(
        request,
    );

    return createRegistration({

        seasonId:
            request.seasonId,

        competitionId:
            request.competitionId,

        poolId:
            request.poolId,

        registrationName:
            request.registrationName.trim(),

        captainId:
            request.captainId,

        playerIds:
            Array.from(
                new Set(
                    request.playerIds,
                ),
            ),

        homeVenueId:
            request.homeVenueId,

        active:
            request.active,

    });

}

export async function updateAdminRegistration(

    registrationId: string,

    request: AdminRegistrationRequest,

): Promise<void> {

    await validateRequest(
        request,
    );

    await updateRegistration(

        registrationId,

        {

            registrationName:
                request.registrationName.trim(),

            captainId:
                request.captainId,

            playerIds:
                Array.from(
                    new Set(
                        request.playerIds,
                    ),
                ),

            homeVenueId:
                request.homeVenueId,

            active:
                request.active,

        },

    );

}