import {
    Timestamp,
    doc,
    serverTimestamp,
    writeBatch,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

import type {
    SeasonImportV2AnalysisResult,
    SeasonImportV2ExecutionResult,
    SeasonImportV2File,
} from "../model/season-import-v2.types";

import {
    analyzeSeasonImportV2,
} from "./analyze-season-import-v2";

/*
 * ============================================================
 * CONFIGURATION
 * ============================================================
 */

const MAX_BATCH_WRITES =
    400;

/*
 * ============================================================
 * TYPES INTERNES
 * ============================================================
 */

interface ImportWrite {

    collection:
    | "pools"
    | "registrations"
    | "matchdays"
    | "matches";

    id: string;

    data:
    Record<string, unknown>;

}

/*
 * ============================================================
 * DATE YYYY-MM-DD -> TIMESTAMP
 * ============================================================
 */

function dateToTimestamp(
    value: string,
): Timestamp {

    const [
        year,
        month,
        day,
    ] =
        value
            .split("-")
            .map(Number);

    /*
     * Construction en heure locale.
     *
     * Cela reste cohérent avec le fonctionnement
     * actuel de nos journées.
     */
    const date =
        new Date(
            year,
            month - 1,
            day,
            0,
            0,
            0,
            0,
        );

    return Timestamp.fromDate(
        date,
    );

}

/*
 * ============================================================
 * CREATE ?
 * ============================================================
 */

function mustCreate(
    analysis:
        SeasonImportV2AnalysisResult,
    entityType:
        "POOL"
        | "REGISTRATION"
        | "MATCHDAY"
        | "MATCH",
    id: string,
): boolean {

    return analysis.items.some(
        item =>
            item.entityType ===
            entityType
            &&
            item.id ===
            id
            &&
            item.action ===
            "CREATE",
    );

}

/*
 * ============================================================
 * CONSTRUCTION DES ECRITURES
 * ============================================================
 */

function buildWrites(
    data:
        SeasonImportV2File,
    analysis:
        SeasonImportV2AnalysisResult,
): ImportWrite[] {

    const writes:
        ImportWrite[] = [];

    /*
     * ========================================================
     * POOL
     * ========================================================
     */

    if (
        data.scope ===
        "POOL"
    ) {

        /*
         * ----------------------------------------------------
         * POULE
         * ----------------------------------------------------
         */

        if (
            mustCreate(
                analysis,
                "POOL",
                data.pool.id,
            )
        ) {

            writes.push({

                collection:
                    "pools",

                id:
                    data.pool.id,

                data: {

                    competitionId:
                        data.competitionId,

                    name:
                        data.pool.name,

                    order:
                        data.pool.order,

                    active:
                        data.pool.active,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),

                },

            });

        }

        /*
         * ----------------------------------------------------
         * INSCRIPTIONS
         * ----------------------------------------------------
         */

        for (
            const registration
            of data.registrations
        ) {

            if (
                !mustCreate(
                    analysis,
                    "REGISTRATION",
                    registration.id,
                )
            ) {

                continue;

            }

            writes.push({

                collection:
                    "registrations",

                id:
                    registration.id,

                data: {

                    seasonId:
                        data.seasonId,

                    competitionId:
                        data.competitionId,

                    poolId:
                        data.pool.id,

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
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),

                },

            });

        }

        /*
         * ----------------------------------------------------
         * JOURNEES
         * ----------------------------------------------------
         */

        for (
            const matchDay
            of data.matchDays
        ) {

            if (
                !mustCreate(
                    analysis,
                    "MATCHDAY",
                    matchDay.id,
                )
            ) {

                continue;

            }

            writes.push({

                collection:
                    "matchdays",

                id:
                    matchDay.id,

                data: {

                    seasonId:
                        data.seasonId,

                    competitionId:
                        data.competitionId,

                    poolId:
                        data.pool.id,

                    number:
                        matchDay.number,

                    displayName:
                        matchDay.displayName
                        ||
                        `Journée ${matchDay.number}`,

                    officialDate:
                        dateToTimestamp(
                            matchDay.officialDate,
                        ),

                    active:
                        matchDay.active,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),

                },

            });

        }

        /*
         * ----------------------------------------------------
         * MATCHS
         * ----------------------------------------------------
         */

        for (
            const match
            of data.matches
        ) {

            if (
                !mustCreate(
                    analysis,
                    "MATCH",
                    match.id,
                )
            ) {

                continue;

            }

            writes.push({

                collection:
                    "matches",

                id:
                    match.id,

                data: {

                    matchDayId:
                        match.matchDayId,

                    homeRegistrationId:
                        match.homeRegistrationId,

                    awayRegistrationId:
                        match.awayRegistrationId,

                    /*
                     * Workflow réservation réinitialisé.
                     */
                    status:
                        "NOT_PLANNED",

                    plannedReservationId:
                        null,

                    /*
                     * Historique sportif conservé.
                     */
                    playStatus:
                        match.playStatus,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),

                },

            });

        }

    }

    /*
     * ========================================================
     * MATCHES
     * ========================================================
     */

    if (
        data.scope ===
        "MATCHES"
    ) {

        for (
            const match
            of data.matches
        ) {

            if (
                !mustCreate(
                    analysis,
                    "MATCH",
                    match.id,
                )
            ) {

                continue;

            }

            writes.push({

                collection:
                    "matches",

                id:
                    match.id,

                data: {

                    matchDayId:
                        match.matchDayId,

                    homeRegistrationId:
                        match.homeRegistrationId,

                    awayRegistrationId:
                        match.awayRegistrationId,

                    status:
                        "NOT_PLANNED",

                    plannedReservationId:
                        null,

                    playStatus:
                        match.playStatus,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),

                },

            });

        }

    }

    return writes;

}

/*
 * ============================================================
 * COMMIT
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

            /*
             * Important :
             *
             * set() sans merge.
             *
             * Mais seuls les documents classés CREATE
             * par l'analyse peuvent arriver ici.
             */
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
 * EXECUTION
 * ============================================================
 */

export async function executeSeasonImportV2(
    data: SeasonImportV2File,
): Promise<SeasonImportV2ExecutionResult> {

    /*
     * IMPORTANT :
     *
     * On refait TOUJOURS l'analyse juste avant
     * l'écriture.
     *
     * On ne fait jamais confiance à une analyse
     * effectuée plusieurs secondes/minutes auparavant.
     */

    const analysis =
        await analyzeSeasonImportV2(
            data,
        );

    /*
     * ========================================================
     * SECURITE
     * ========================================================
     */

    if (
        !analysis.valid
        ||
        analysis.statistics.conflicts >
        0
    ) {

        throw new Error(
            "IMPORT_V2_CONFLICT",
        );

    }

    /*
     * ========================================================
     * ECRITURES
     * ========================================================
     */

    const writes =
        buildWrites(
            data,
            analysis,
        );

    await commitWrites(
        writes,
    );

    return {

        scope:
            data.scope,

        seasonId:
            data.seasonId,

        competitionId:
            data.competitionId,

        poolId:
            data.scope ===
                "POOL"
                ? data.pool.id
                : data.poolId,

        statistics: {

            created:
                writes.length,

            skipped:
                analysis
                    .statistics
                    .skips,

            dependencies:
                analysis
                    .statistics
                    .dependencies,

        },

    };

}