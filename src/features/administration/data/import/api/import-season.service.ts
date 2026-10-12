import {
    Timestamp,
    doc,
    writeBatch,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

import type {
    SeasonImportFile,
    SeasonImportExecutionResult,
} from "../model/season-import.types";

import type {
    SeasonExportTimestamp,
} from "../../export/model/season-export.types";

/*
 * Marge volontaire sous la limite Firestore.
 */
const MAX_BATCH_WRITES =
    400;

interface ImportWrite {

    collection:
    | "seasons"
    | "competitions"
    | "pools"
    | "registrations"
    | "matchdays"
    | "matches";

    id: string;

    data:
    Record<string, unknown>;

}

function toTimestamp(
    value:
        SeasonExportTimestamp
        | undefined,
): Timestamp | undefined {

    if (!value) {

        return undefined;

    }

    return new Timestamp(
        value.seconds,
        value.nanoseconds,
    );

}

function removeUndefined(
    value:
        Record<string, unknown>,
): Record<string, unknown> {

    return Object.fromEntries(

        Object.entries(
            value,
        ).filter(
            ([, item]) =>
                item !== undefined,
        ),

    );

}

/*
 * ============================================================
 * CONSTRUCTION DES ECRITURES
 * ============================================================
 */

function buildImportWrites(
    data: SeasonImportFile,
): ImportWrite[] {

    const writes:
        ImportWrite[] = [];

    /*
     * ------------------------------------------------------------
     * SEASON
     * ------------------------------------------------------------
     */

    writes.push({

        collection:
            "seasons",

        id:
            data.season.id,

        data:
            removeUndefined({

                name:
                    data.season.name,

                /*
                 * Une saison importée ne devient jamais
                 * automatiquement la saison active.
                 */
                active:
                    false,

                createdAt:
                    toTimestamp(
                        data.season.createdAt,
                    ),

                updatedAt:
                    toTimestamp(
                        data.season.updatedAt,
                    ),

            }),

    });

    /*
     * ------------------------------------------------------------
     * COMPETITIONS
     * ------------------------------------------------------------
     */

    for (
        const competition
        of data.competitions
    ) {

        writes.push({

            collection:
                "competitions",

            id:
                competition.id,

            data:
                removeUndefined({

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
                        toTimestamp(
                            competition.createdAt,
                        ),

                    updatedAt:
                        toTimestamp(
                            competition.updatedAt,
                        ),

                }),

        });

    }

    /*
     * ------------------------------------------------------------
     * POOLS
     * ------------------------------------------------------------
     */

    for (
        const pool
        of data.pools
    ) {

        writes.push({

            collection:
                "pools",

            id:
                pool.id,

            data:
                removeUndefined({

                    competitionId:
                        pool.competitionId,

                    name:
                        pool.name,

                    order:
                        pool.order,

                    active:
                        pool.active,

                    createdAt:
                        toTimestamp(
                            pool.createdAt,
                        ),

                    updatedAt:
                        toTimestamp(
                            pool.updatedAt,
                        ),

                }),

        });

    }

    /*
     * ------------------------------------------------------------
     * REGISTRATIONS
     * ------------------------------------------------------------
     */

    for (
        const registration
        of data.registrations
    ) {

        writes.push({

            collection:
                "registrations",

            id:
                registration.id,

            data:
                removeUndefined({

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
                        toTimestamp(
                            registration.createdAt,
                        ),

                    updatedAt:
                        toTimestamp(
                            registration.updatedAt,
                        ),

                }),

        });

    }

    /*
     * ------------------------------------------------------------
     * MATCH DAYS
     * ------------------------------------------------------------
     */

    for (
        const matchDay
        of data.matchDays
    ) {

        writes.push({

            collection:
                "matchdays",

            id:
                matchDay.id,

            data:
                removeUndefined({

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
                        toTimestamp(
                            matchDay.officialDate,
                        ),

                    active:
                        matchDay.active,

                    createdAt:
                        toTimestamp(
                            matchDay.createdAt,
                        ),

                    updatedAt:
                        toTimestamp(
                            matchDay.updatedAt,
                        ),

                }),

        });

    }

    /*
     * ------------------------------------------------------------
     * MATCHES
     * ------------------------------------------------------------
     */

    for (
        const match
        of data.matches
    ) {

        writes.push({

            collection:
                "matches",

            id:
                match.id,

            data:
                removeUndefined({

                    matchDayId:
                        match.matchDayId,

                    homeRegistrationId:
                        match.homeRegistrationId,

                    awayRegistrationId:
                        match.awayRegistrationId,

                    /*
                     * L'import ne restaure jamais
                     * l'état opérationnel des réservations.
                     */
                    status:
                        "NOT_PLANNED",

                    plannedReservationId:
                        null,

                    createdAt:
                        toTimestamp(
                            match.createdAt,
                        ),

                    updatedAt:
                        toTimestamp(
                            match.updatedAt,
                        ),

                }),

        });

    }

    return writes;

}

/*
 * ============================================================
 * COMMIT PAR LOTS
 * ============================================================
 */

async function commitWrites(
    writes: ImportWrite[],
): Promise<void> {

    for (
        let start = 0;
        start < writes.length;
        start += MAX_BATCH_WRITES
    ) {

        const chunk =
            writes.slice(
                start,
                start +
                MAX_BATCH_WRITES,
            );

        const batch =
            writeBatch(
                db,
            );

        for (
            const write
            of chunk
        ) {

            batch.set(

                doc(
                    db,
                    write.collection,
                    write.id,
                ),

                write.data,

            );

        }

        await batch.commit();

    }

}

/*
 * ============================================================
 * IMPORT
 * ============================================================
 */

export async function importSeason(
    data: SeasonImportFile,
): Promise<SeasonImportExecutionResult> {

    const writes =
        buildImportWrites(
            data,
        );

    await commitWrites(
        writes,
    );

    return {

        seasonId:
            data.season.id,

        competitions:
            data.competitions.length,

        pools:
            data.pools.length,

        registrations:
            data.registrations.length,

        matchDays:
            data.matchDays.length,

        matches:
            data.matches.length,

        totalDocuments:
            writes.length,

    };

}