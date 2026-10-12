import type {
    Timestamp,
} from "firebase/firestore";

import {
    getCompetitionsBySeason,
} from "@/entities/competition";

import {
    getPoolsByCompetition,
} from "@/entities/pool";

import {
    getAllRegistrationsByCompetition,
} from "@/entities/registration";

import {
    getAllMatchDays,
} from "@/entities/matchday";

import {
    getMatchesByMatchDay,
} from "@/entities/match";

import type {
    Season,
} from "@/entities/season";

import type {
    SeasonExportFile,
    SeasonExportTimestamp,
} from "../model/season-export.types";

function exportTimestamp(
    timestamp:
        | Timestamp
        | undefined,
): SeasonExportTimestamp | undefined {

    if (!timestamp) {

        return undefined;

    }

    return {

        seconds:
            timestamp.seconds,

        nanoseconds:
            timestamp.nanoseconds,

    };

}

export async function buildSeasonExport(
    season: Season,
): Promise<SeasonExportFile> {

    /*
     * ============================================================
     * COMPETITIONS
     * ============================================================
     */

    const competitions =
        await getCompetitionsBySeason(
            season.id,
        );

    /*
     * ============================================================
     * POULES
     * ============================================================
     */

    const poolGroups =
        await Promise.all(
            competitions.map(
                competition =>
                    getPoolsByCompetition(
                        competition.id,
                    ),
            ),
        );

    const pools =
        poolGroups.flat();

    /*
     * ============================================================
     * INSCRIPTIONS
     * ============================================================
     */

    const registrationGroups =
        await Promise.all(
            pools.map(
                pool =>
                    getAllRegistrationsByCompetition(

                        pool.competitionId,

                        pool.id,

                    ),
            ),
        );

    const registrations =
        registrationGroups.flat();

    /*
     * ============================================================
     * JOURNEES
     * ============================================================
     */

    const matchDayGroups =
        await Promise.all(
            pools.map(
                pool =>
                    getAllMatchDays(

                        pool.competitionId,

                        pool.id,

                    ),
            ),
        );

    const matchDays =
        matchDayGroups.flat();

    /*
     * ============================================================
     * MATCHS
     * ============================================================
     */

    const matchGroups =
        await Promise.all(
            matchDays.map(
                matchDay =>
                    getMatchesByMatchDay(
                        matchDay.id,
                    ),
            ),
        );

    const matches =
        matchGroups.flat();

    /*
     * ============================================================
     * EXPORT
     * ============================================================
     */

    return {

        schemaVersion:
            1,

        exportedAt:
            new Date().toISOString(),

        season: {

            id:
                season.id,

            name:
                season.name,

            active:
                season.active,

            createdAt:
                exportTimestamp(
                    season.createdAt,
                ),

            updatedAt:
                exportTimestamp(
                    season.updatedAt,
                ),

        },

        competitions:
            competitions.map(
                competition => ({

                    id:
                        competition.id,

                    seasonId:
                        competition.seasonId,

                    name:
                        competition.name,

                    type:
                        competition.type,

                    active:
                        competition.active,

                    matchDurationMinutes:
                        competition.matchDurationMinutes,

                    createdAt:
                        exportTimestamp(
                            competition.createdAt,
                        ),

                    updatedAt:
                        exportTimestamp(
                            competition.updatedAt,
                        ),

                }),
            ),

        pools:
            pools.map(
                pool => ({

                    id:
                        pool.id,

                    competitionId:
                        pool.competitionId,

                    name:
                        pool.name,

                    order:
                        pool.order,

                    active:
                        pool.active,

                    createdAt:
                        exportTimestamp(
                            pool.createdAt,
                        ),

                    updatedAt:
                        exportTimestamp(
                            pool.updatedAt,
                        ),

                }),
            ),

        registrations:
            registrations.map(
                registration => ({

                    id:
                        registration.id,

                    seasonId:
                        registration.seasonId,

                    competitionId:
                        registration.competitionId,

                    poolId:
                        registration.poolId,

                    registrationName:
                        registration.registrationName,

                    captainId:
                        registration.captainId,

                    playerIds:
                        registration.playerIds,

                    homeVenueId:
                        registration.homeVenueId,

                    active:
                        registration.active,

                    createdAt:
                        exportTimestamp(
                            registration.createdAt,
                        ),

                    updatedAt:
                        exportTimestamp(
                            registration.updatedAt,
                        ),

                }),
            ),

        matchDays:
            matchDays.map(
                matchDay => ({

                    id:
                        matchDay.id,

                    seasonId:
                        matchDay.seasonId,

                    competitionId:
                        matchDay.competitionId,

                    poolId:
                        matchDay.poolId,

                    number:
                        matchDay.number,

                    displayName:
                        matchDay.displayName
                        ||
                        `Journée ${matchDay.number}`,

                    officialDate:
                        exportTimestamp(
                            matchDay.officialDate,
                        )!,

                    active:
                        matchDay.active,

                    createdAt:
                        exportTimestamp(
                            matchDay.createdAt,
                        ),

                    updatedAt:
                        exportTimestamp(
                            matchDay.updatedAt,
                        ),

                }),
            ),

        matches:
            matches.map(
                match => ({

                    id:
                        match.id,

                    matchDayId:
                        match.matchDayId,

                    homeRegistrationId:
                        match.homeRegistrationId,

                    awayRegistrationId:
                        match.awayRegistrationId,

                    status:
                        match.status,

                    playStatus:
                        match.playStatus
                        ??
                        "TO_PLAY",

                    plannedReservationId:
                        match.plannedReservationId
                        ||
                        null,

                    createdAt:
                        exportTimestamp(
                            match.createdAt,
                        ),

                    updatedAt:
                        exportTimestamp(
                            match.updatedAt,
                        ),

                }),
            ),

    };

}