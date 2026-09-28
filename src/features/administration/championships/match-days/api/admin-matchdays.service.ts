import {
    createMatchDay,
    getAllMatchDays,
    updateMatchDay,
} from "@/entities/matchday";

import {
    getCompetition,
} from "@/entities/competition";

import {
    getPool,
} from "@/entities/pool";

import type {
    MatchDay,
} from "@/entities/matchday";

import type {
    AdminMatchDayRequest,
} from "../model/admin-matchday.types";

async function validateMatchDay(
    request: AdminMatchDayRequest,
): Promise<void> {

    if (
        !Number.isInteger(
            request.number,
        )
        ||
        request.number < 1
    ) {

        throw new Error(
            "MATCHDAY_NUMBER_INVALID",
        );

    }

    if (
        request.displayName.trim() === ""
    ) {

        throw new Error(
            "MATCHDAY_NAME_REQUIRED",
        );

    }

    const competition =
        await getCompetition(
            request.competitionId,
        );

    if (
        !competition
        ||
        competition.seasonId !==
        request.seasonId
    ) {

        throw new Error(
            "MATCHDAY_COMPETITION_INVALID",
        );

    }

    const pool =
        await getPool(
            request.poolId,
        );

    if (
        !pool
        ||
        pool.competitionId !==
        competition.id
    ) {

        throw new Error(
            "MATCHDAY_POOL_INVALID",
        );

    }

}

export async function loadAdminMatchDays(

    competitionId: string,

    poolId: string,

): Promise<MatchDay[]> {

    if (
        !competitionId
        ||
        !poolId
    ) {

        return [];

    }

    const matchDays =
        await getAllMatchDays(
            competitionId,
            poolId,
        );

    return [...matchDays].sort(
        (a, b) =>
            a.number -
            b.number,
    );

}

export async function createAdminMatchDay(
    request: AdminMatchDayRequest,
): Promise<string> {

    await validateMatchDay(
        request,
    );

    return createMatchDay({

        ...request,

        displayName:
            request.displayName.trim(),

    });

}

export async function updateAdminMatchDay(

    matchDayId: string,

    request: AdminMatchDayRequest,

): Promise<void> {

    await validateMatchDay(
        request,
    );

    await updateMatchDay(

        matchDayId,

        {

            number:
                request.number,

            displayName:
                request.displayName.trim(),

            officialDate:
                request.officialDate,

            active:
                request.active,

        },

    );

}