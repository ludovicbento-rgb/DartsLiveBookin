import {
    Timestamp,
    doc,
    getDoc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

import type {
    SeasonImportIssue,
} from "../model/season-import.types";

import type {
    SeasonImportV2Action,
    SeasonImportV2AnalysisItem,
    SeasonImportV2AnalysisResult,
    SeasonImportV2File,
    SeasonImportV2Match,
    SeasonImportV2MatchDay,
    SeasonImportV2Pool,
    SeasonImportV2Registration,
} from "../model/season-import-v2.types";

import {
    validateSeasonImportV2,
} from "./validate-season-import-v2";

import {
    validateImportV2References,
} from "./validate-import-v2-references";

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function addIssue(
    issues: SeasonImportIssue[],
    code: string,
    message: string,
    path?: string,
): void {

    issues.push({

        severity:
            "ERROR",

        code,

        message,

        path,

    });

}

function addItem(
    items: SeasonImportV2AnalysisItem[],
    entityType:
        SeasonImportV2AnalysisItem["entityType"],
    id: string,
    label: string,
    action: SeasonImportV2Action,
    message?: string,
): void {

    items.push({

        entityType,

        id,

        label,

        action,

        message,

    });

}

/*
 * ============================================================
 * NORMALISATION
 * ============================================================
 */

function normalizeStringArray(
    values: unknown,
): string[] {

    if (!Array.isArray(values)) {

        return [];

    }

    return values
        .filter(
            (
                value,
            ): value is string =>
                typeof value ===
                "string",
        )
        .sort();

}

function arraysEqual(
    left: string[],
    right: string[],
): boolean {

    if (
        left.length !==
        right.length
    ) {

        return false;

    }

    return left.every(
        (value, index) =>
            value ===
            right[index],
    );

}

function firestoreDateToIso(
    value: unknown,
): string | null {

    if (
        !(value instanceof Timestamp)
    ) {

        return null;

    }

    const date =
        value.toDate();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1,
        ).padStart(
            2,
            "0",
        );

    const day =
        String(
            date.getDate(),
        ).padStart(
            2,
            "0",
        );

    return `${year}-${month}-${day}`;

}

/*
 * ============================================================
 * COMPARAISONS METIER
 * ============================================================
 */

function poolMatches(
    existing:
        Record<string, unknown>,
    incoming:
        SeasonImportV2Pool,
    competitionId: string,
): boolean {

    return (

        existing.competitionId ===
        competitionId

        &&

        existing.name ===
        incoming.name

        &&

        existing.order ===
        incoming.order

        &&

        existing.active ===
        incoming.active

    );

}

function registrationMatches(
    existing:
        Record<string, unknown>,
    incoming:
        SeasonImportV2Registration,
    seasonId: string,
    competitionId: string,
    poolId: string,
): boolean {

    const existingPlayers =
        normalizeStringArray(
            existing.playerIds,
        );

    const incomingPlayers =
        [...incoming.playerIds]
            .sort();

    return (

        existing.seasonId ===
        seasonId

        &&

        existing.competitionId ===
        competitionId

        &&

        existing.poolId ===
        poolId

        &&

        existing.registrationName ===
        incoming.registrationName

        &&

        existing.captainId ===
        incoming.captainId

        &&

        arraysEqual(
            existingPlayers,
            incomingPlayers,
        )

        &&

        existing.homeVenueId ===
        incoming.homeVenueId

        &&

        existing.active ===
        incoming.active

    );

}

function matchDayMatches(
    existing:
        Record<string, unknown>,
    incoming:
        SeasonImportV2MatchDay,
    seasonId: string,
    competitionId: string,
    poolId: string,
): boolean {

    return (

        existing.seasonId ===
        seasonId

        &&

        existing.competitionId ===
        competitionId

        &&

        existing.poolId ===
        poolId

        &&

        existing.number ===
        incoming.number

        &&

        (
            existing.displayName ===
            incoming.displayName

            ||

            (
                !existing.displayName

                &&

                incoming.displayName ===
                `Journée ${incoming.number}`
            )
        )

        &&

        firestoreDateToIso(
            existing.officialDate,
        ) ===
        incoming.officialDate

        &&

        existing.active ===
        incoming.active

    );

}

function matchMatches(
    existing:
        Record<string, unknown>,
    incoming:
        SeasonImportV2Match,
): boolean {

    /*
     * Pour un ancien match sans playStatus,
     * on considère TO_PLAY.
     */

    const existingPlayStatus =
        existing.playStatus ===
            "PLAYED"
            ? "PLAYED"
            : "TO_PLAY";

    return (

        existing.matchDayId ===
        incoming.matchDayId

        &&

        existing.homeRegistrationId ===
        incoming.homeRegistrationId

        &&

        existing.awayRegistrationId ===
        incoming.awayRegistrationId

        &&

        existingPlayStatus ===
        incoming.playStatus

    );

}

/*
 * ============================================================
 * DOCUMENT
 * ============================================================
 */

async function readDocument(
    collectionName: string,
    id: string,
) {

    return getDoc(
        doc(
            db,
            collectionName,
            id,
        ),
    );

}

/*
 * ============================================================
 * ANALYSE PRINCIPALE
 * ============================================================
 */

export async function analyzeSeasonImportV2(
    data: SeasonImportV2File,
): Promise<SeasonImportV2AnalysisResult> {

    const items:
        SeasonImportV2AnalysisItem[] = [];

    const issues:
        SeasonImportIssue[] = [];

    /*
     * ------------------------------------------------------------
     * Validation structurelle avant Firestore
     * ------------------------------------------------------------
     */

    const structural =
        validateSeasonImportV2(
            data,
        );

    if (!structural.valid) {

        return {

            valid:
                false,

            scope:
                data.scope,

            seasonId:
                data.seasonId,

            competitionId:
                data.competitionId,

            poolId:
                data.scope === "POOL"
                    ? data.pool.id
                    : data.poolId,

            items:
                [],

            issues:
                structural.issues,

            statistics: {

                dependencies: 0,

                creates: 0,

                skips: 0,

                conflicts: 0,

            },

        };

    }

    /*
 * ============================================================
 * REFERENCES EXTERNES
 * ============================================================
 *
 * Pour POOL :
 * - users
 * - venues
 *
 * Pour MATCHES :
 * aucune lecture supplémentaire ici.
 */

    const externalIssues =
        await validateImportV2References(
            data,
        );

    issues.push(
        ...externalIssues,
    );

    /*
     * ============================================================
     * SAISON : DEPENDENCY
     * ============================================================
     */

    const seasonSnapshot =
        await readDocument(
            "seasons",
            data.seasonId,
        );

    if (!seasonSnapshot.exists()) {

        addIssue(
            issues,
            "IMPORT_V2_SEASON_NOT_FOUND",
            `La saison ${data.seasonId} n'existe pas dans Firestore.`,
            "seasonId",
        );

        addItem(
            items,
            "SEASON",
            data.seasonId,
            data.seasonId,
            "CONFLICT",
            "Dépendance introuvable.",
        );

    }
    else {

        addItem(
            items,
            "SEASON",
            data.seasonId,
            String(
                seasonSnapshot.data().name
                ??
                data.seasonId,
            ),
            "DEPENDENCY",
            "Saison existante.",
        );

    }

    /*
     * ============================================================
     * COMPETITION : DEPENDENCY
     * ============================================================
     */

    const competitionSnapshot =
        await readDocument(
            "competitions",
            data.competitionId,
        );

    if (!competitionSnapshot.exists()) {

        addIssue(
            issues,
            "IMPORT_V2_COMPETITION_NOT_FOUND",
            `La compétition ${data.competitionId} n'existe pas dans Firestore.`,
            "competitionId",
        );

        addItem(
            items,
            "COMPETITION",
            data.competitionId,
            data.competitionId,
            "CONFLICT",
            "Dépendance introuvable.",
        );

    }
    else {

        const competitionData =
            competitionSnapshot.data();

        let competitionValid =
            competitionData.seasonId ===
            data.seasonId;

        if (
            data.scope === "POOL"
        ) {

            competitionValid =
                competitionValid
                &&
                competitionData.type ===
                data.competitionType;

        }

        if (!competitionValid) {

            addIssue(
                issues,
                "IMPORT_V2_COMPETITION_MISMATCH",
                `La compétition ${data.competitionId} ne correspond pas au contexte du fichier.`,
                "competitionId",
            );

            addItem(
                items,
                "COMPETITION",
                data.competitionId,
                String(
                    competitionData.name
                    ??
                    data.competitionId,
                ),
                "CONFLICT",
                "Compétition incompatible avec le fichier.",
            );

        }
        else {

            addItem(
                items,
                "COMPETITION",
                data.competitionId,
                String(
                    competitionData.name
                    ??
                    data.competitionId,
                ),
                "DEPENDENCY",
                "Compétition existante et compatible.",
            );

        }

    }

    /*
     * ============================================================
     * SCOPE POOL
     * ============================================================
     */

    if (
        data.scope === "POOL"
    ) {

        const poolId =
            data.pool.id;

        /*
         * --------------------------------------------------------
         * POOL
         * --------------------------------------------------------
         */

        const poolSnapshot =
            await readDocument(
                "pools",
                poolId,
            );

        if (!poolSnapshot.exists()) {

            addItem(
                items,
                "POOL",
                poolId,
                data.pool.name,
                "CREATE",
                "La poule sera créée.",
            );

        }
        else if (
            poolMatches(
                poolSnapshot.data(),
                data.pool,
                data.competitionId,
            )
        ) {

            addItem(
                items,
                "POOL",
                poolId,
                data.pool.name,
                "SKIP",
                "La poule existe déjà avec les mêmes données.",
            );

        }
        else {

            addIssue(
                issues,
                "IMPORT_V2_POOL_CONFLICT",
                `La poule ${poolId} existe déjà avec des données différentes.`,
                "pool.id",
            );

            addItem(
                items,
                "POOL",
                poolId,
                data.pool.name,
                "CONFLICT",
                "Données différentes.",
            );

        }

        /*
         * --------------------------------------------------------
         * REGISTRATIONS
         * --------------------------------------------------------
         */

        for (
            const registration
            of data.registrations
        ) {

            const snapshot =
                await readDocument(
                    "registrations",
                    registration.id,
                );

            if (!snapshot.exists()) {

                addItem(
                    items,
                    "REGISTRATION",
                    registration.id,
                    registration.registrationName,
                    "CREATE",
                    "L'inscription sera créée.",
                );

                continue;

            }

            if (
                registrationMatches(
                    snapshot.data(),
                    registration,
                    data.seasonId,
                    data.competitionId,
                    poolId,
                )
            ) {

                addItem(
                    items,
                    "REGISTRATION",
                    registration.id,
                    registration.registrationName,
                    "SKIP",
                    "Inscription déjà identique.",
                );

            }
            else {

                addIssue(
                    issues,
                    "IMPORT_V2_REGISTRATION_CONFLICT",
                    `L'inscription ${registration.registrationName} existe déjà avec des données différentes.`,
                    `registrations/${registration.id}`,
                );

                addItem(
                    items,
                    "REGISTRATION",
                    registration.id,
                    registration.registrationName,
                    "CONFLICT",
                    "Données différentes.",
                );

            }

        }

        /*
         * --------------------------------------------------------
         * MATCH DAYS
         * --------------------------------------------------------
         */

        for (
            const matchDay
            of data.matchDays
        ) {

            const snapshot =
                await readDocument(
                    "matchdays",
                    matchDay.id,
                );

            const label =
                matchDay.displayName
                ||
                `Journée ${matchDay.number}`;

            if (!snapshot.exists()) {

                addItem(
                    items,
                    "MATCHDAY",
                    matchDay.id,
                    label,
                    "CREATE",
                    "La journée sera créée.",
                );

                continue;

            }

            if (
                matchDayMatches(
                    snapshot.data(),
                    matchDay,
                    data.seasonId,
                    data.competitionId,
                    poolId,
                )
            ) {

                addItem(
                    items,
                    "MATCHDAY",
                    matchDay.id,
                    label,
                    "SKIP",
                    "Journée déjà identique.",
                );

            }
            else {

                addIssue(
                    issues,
                    "IMPORT_V2_MATCHDAY_CONFLICT",
                    `La journée ${label} existe déjà avec des données différentes.`,
                    `matchDays/${matchDay.id}`,
                );

                addItem(
                    items,
                    "MATCHDAY",
                    matchDay.id,
                    label,
                    "CONFLICT",
                    "Données différentes.",
                );

            }

        }

        /*
         * --------------------------------------------------------
         * MATCHES
         * --------------------------------------------------------
         */

        for (
            const match
            of data.matches
        ) {

            const snapshot =
                await readDocument(
                    "matches",
                    match.id,
                );

            const label =
                `${match.homeRegistrationId} vs ${match.awayRegistrationId}`;

            if (!snapshot.exists()) {

                addItem(
                    items,
                    "MATCH",
                    match.id,
                    label,
                    "CREATE",
                    match.playStatus === "PLAYED"
                        ? "Match historique à créer."
                        : "Match futur à créer.",
                );

                continue;

            }

            if (
                matchMatches(
                    snapshot.data(),
                    match,
                )
            ) {

                addItem(
                    items,
                    "MATCH",
                    match.id,
                    label,
                    "SKIP",
                    "Match déjà identique.",
                );

            }
            else {

                addIssue(
                    issues,
                    "IMPORT_V2_MATCH_CONFLICT",
                    `Le match ${match.id} existe déjà avec des données différentes.`,
                    `matches/${match.id}`,
                );

                addItem(
                    items,
                    "MATCH",
                    match.id,
                    label,
                    "CONFLICT",
                    "Données différentes.",
                );

            }

        }

    }

    /*
     * ============================================================
     * SCOPE MATCHES
     * ============================================================
     */

    if (
        data.scope === "MATCHES"
    ) {

        /*
         * --------------------------------------------------------
         * POOL : DEPENDENCY
         * --------------------------------------------------------
         */

        const poolSnapshot =
            await readDocument(
                "pools",
                data.poolId,
            );

        if (!poolSnapshot.exists()) {

            addIssue(
                issues,
                "IMPORT_V2_POOL_NOT_FOUND",
                `La poule ${data.poolId} n'existe pas.`,
                "poolId",
            );

            addItem(
                items,
                "POOL",
                data.poolId,
                data.poolId,
                "CONFLICT",
                "Dépendance introuvable.",
            );

        }
        else if (
            poolSnapshot.data().competitionId !==
            data.competitionId
        ) {

            addIssue(
                issues,
                "IMPORT_V2_POOL_COMPETITION_MISMATCH",
                `La poule ${data.poolId} n'appartient pas à ${data.competitionId}.`,
                "poolId",
            );

            addItem(
                items,
                "POOL",
                data.poolId,
                String(
                    poolSnapshot.data().name
                    ??
                    data.poolId,
                ),
                "CONFLICT",
                "Poule incompatible.",
            );

        }
        else {

            addItem(
                items,
                "POOL",
                data.poolId,
                String(
                    poolSnapshot.data().name
                    ??
                    data.poolId,
                ),
                "DEPENDENCY",
                "Poule existante.",
            );

        }

        /*
         * --------------------------------------------------------
         * MATCHES + DEPENDANCES
         * --------------------------------------------------------
         */

        for (
            const match
            of data.matches
        ) {

            /*
             * Journée.
             */

            const matchDaySnapshot =
                await readDocument(
                    "matchdays",
                    match.matchDayId,
                );

            if (!matchDaySnapshot.exists()) {

                addIssue(
                    issues,
                    "IMPORT_V2_MATCHDAY_DEPENDENCY_NOT_FOUND",
                    `La journée ${match.matchDayId} n'existe pas.`,
                    `matches/${match.id}/matchDayId`,
                );

            }
            else {

                const matchDayData =
                    matchDaySnapshot.data();

                if (
                    matchDayData.competitionId !==
                    data.competitionId
                    ||
                    matchDayData.poolId !==
                    data.poolId
                ) {

                    addIssue(
                        issues,
                        "IMPORT_V2_MATCHDAY_CONTEXT_MISMATCH",
                        `La journée ${match.matchDayId} n'appartient pas au contexte demandé.`,
                        `matches/${match.id}/matchDayId`,
                    );

                }

            }

            /*
             * Inscriptions.
             */

            const [
                homeSnapshot,
                awaySnapshot,
            ] =
                await Promise.all([

                    readDocument(
                        "registrations",
                        match.homeRegistrationId,
                    ),

                    readDocument(
                        "registrations",
                        match.awayRegistrationId,
                    ),

                ]);

            if (!homeSnapshot.exists()) {

                addIssue(
                    issues,
                    "IMPORT_V2_HOME_DEPENDENCY_NOT_FOUND",
                    `L'inscription ${match.homeRegistrationId} n'existe pas.`,
                    `matches/${match.id}/homeRegistrationId`,
                );

            }
            else {

                const home =
                    homeSnapshot.data();

                if (
                    home.competitionId !==
                    data.competitionId
                    ||
                    home.poolId !==
                    data.poolId
                ) {

                    addIssue(
                        issues,
                        "IMPORT_V2_HOME_CONTEXT_MISMATCH",
                        `L'inscription ${match.homeRegistrationId} n'appartient pas à la poule.`,
                        `matches/${match.id}/homeRegistrationId`,
                    );

                }

            }

            if (!awaySnapshot.exists()) {

                addIssue(
                    issues,
                    "IMPORT_V2_AWAY_DEPENDENCY_NOT_FOUND",
                    `L'inscription ${match.awayRegistrationId} n'existe pas.`,
                    `matches/${match.id}/awayRegistrationId`,
                );

            }
            else {

                const away =
                    awaySnapshot.data();

                if (
                    away.competitionId !==
                    data.competitionId
                    ||
                    away.poolId !==
                    data.poolId
                ) {

                    addIssue(
                        issues,
                        "IMPORT_V2_AWAY_CONTEXT_MISMATCH",
                        `L'inscription ${match.awayRegistrationId} n'appartient pas à la poule.`,
                        `matches/${match.id}/awayRegistrationId`,
                    );

                }

            }

            /*
             * Match lui-même.
             */

            const matchSnapshot =
                await readDocument(
                    "matches",
                    match.id,
                );

            const label =
                `${match.homeRegistrationId} vs ${match.awayRegistrationId}`;

            if (!matchSnapshot.exists()) {

                addItem(
                    items,
                    "MATCH",
                    match.id,
                    label,
                    "CREATE",
                    match.playStatus === "PLAYED"
                        ? "Match historique à créer."
                        : "Match futur à créer.",
                );

            }
            else if (
                matchMatches(
                    matchSnapshot.data(),
                    match,
                )
            ) {

                addItem(
                    items,
                    "MATCH",
                    match.id,
                    label,
                    "SKIP",
                    "Match déjà identique.",
                );

            }
            else {

                addIssue(
                    issues,
                    "IMPORT_V2_MATCH_CONFLICT",
                    `Le match ${match.id} existe avec des données différentes.`,
                    `matches/${match.id}`,
                );

                addItem(
                    items,
                    "MATCH",
                    match.id,
                    label,
                    "CONFLICT",
                    "Données différentes.",
                );

            }

        }

    }

    /*
     * ============================================================
     * STATISTIQUES
     * ============================================================
     */

    const statistics = {

        dependencies:
            items.filter(
                item =>
                    item.action ===
                    "DEPENDENCY",
            ).length,

        creates:
            items.filter(
                item =>
                    item.action ===
                    "CREATE",
            ).length,

        skips:
            items.filter(
                item =>
                    item.action ===
                    "SKIP",
            ).length,

        conflicts:
            items.filter(
                item =>
                    item.action ===
                    "CONFLICT",
            ).length,

    };

    return {

        valid:
            issues.length === 0
            &&
            statistics.conflicts === 0,

        scope:
            data.scope,

        seasonId:
            data.seasonId,

        competitionId:
            data.competitionId,

        poolId:
            data.scope === "POOL"
                ? data.pool.id
                : data.poolId,

        items,

        issues,

        statistics,

    };

}