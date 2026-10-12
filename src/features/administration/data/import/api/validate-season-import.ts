import type {
    SeasonImportFile,
    SeasonImportIssue,
    SeasonImportValidationResult,
} from "../model/season-import.types";

export function validateSeasonImport(
    data: SeasonImportFile,
): SeasonImportValidationResult {

    const issues:
        SeasonImportIssue[] = [];

    const competitionsById =
        new Map(
            data.competitions.map(
                competition => [
                    competition.id,
                    competition,
                ],
            ),
        );

    const poolsById =
        new Map(
            data.pools.map(
                pool => [
                    pool.id,
                    pool,
                ],
            ),
        );

    const registrationsById =
        new Map(
            data.registrations.map(
                registration => [
                    registration.id,
                    registration,
                ],
            ),
        );

    const matchDaysById =
        new Map(
            data.matchDays.map(
                matchDay => [
                    matchDay.id,
                    matchDay,
                ],
            ),
        );

    function error(
        code: string,
        message: string,
        path?: string,
    ) {

        issues.push({
            severity: "ERROR",
            code,
            message,
            path,
        });

    }

    /*
     * ============================================================
     * VERSION
     * ============================================================
     */

    if (
        data.schemaVersion !== 1
    ) {

        error(
            "UNSUPPORTED_SCHEMA_VERSION",
            `Version de schéma non supportée : ${String(data.schemaVersion)}`,
            "schemaVersion",
        );

    }

    /*
     * ============================================================
     * SAISON
     * ============================================================
     */

    if (
        !data.season
        ||
        !data.season.id
    ) {

        error(
            "SEASON_REQUIRED",
            "La saison est absente ou invalide.",
            "season",
        );

    }

    const seasonId =
        data.season?.id;

    /*
     * ============================================================
     * COMPETITIONS
     * ============================================================
     */

    const competitionIds =
        new Set<string>();

    data.competitions.forEach(
        (competition, index) => {

            const path =
                `competitions[${index}]`;

            if (
                competitionIds.has(
                    competition.id,
                )
            ) {

                error(
                    "DUPLICATE_COMPETITION_ID",
                    `ID de compétition dupliqué : ${competition.id}`,
                    `${path}.id`,
                );

            }

            competitionIds.add(
                competition.id,
            );

            if (
                competition.seasonId !==
                seasonId
            ) {

                error(
                    "COMPETITION_SEASON_MISMATCH",
                    `La compétition ${competition.id} n'appartient pas à la saison ${seasonId}.`,
                    `${path}.seasonId`,
                );

            }

            if (
                ![
                    "INDIVIDUAL",
                    "DOUBLES",
                    "TEAM",
                ].includes(
                    competition.type,
                )
            ) {

                error(
                    "COMPETITION_TYPE_INVALID",
                    `Type invalide pour ${competition.id}.`,
                    `${path}.type`,
                );

            }

        },
    );

    /*
     * ============================================================
     * POULES
     * ============================================================
     */

    const poolIds =
        new Set<string>();

    data.pools.forEach(
        (pool, index) => {

            const path =
                `pools[${index}]`;

            if (
                poolIds.has(
                    pool.id,
                )
            ) {

                error(
                    "DUPLICATE_POOL_ID",
                    `ID de poule dupliqué : ${pool.id}`,
                    `${path}.id`,
                );

            }

            poolIds.add(
                pool.id,
            );

            if (
                !competitionIds.has(
                    pool.competitionId,
                )
            ) {

                error(
                    "POOL_COMPETITION_NOT_FOUND",
                    `La compétition ${pool.competitionId} de la poule ${pool.id} n'existe pas dans l'import.`,
                    `${path}.competitionId`,
                );

            }

        },
    );

    /*
     * ============================================================
     * INSCRIPTIONS
     * ============================================================
     */

    const registrationIds =
        new Set<string>();

    data.registrations.forEach(
        (registration, index) => {

            const path =
                `registrations[${index}]`;

            if (
                registrationIds.has(
                    registration.id,
                )
            ) {

                error(
                    "DUPLICATE_REGISTRATION_ID",
                    `ID d'inscription dupliqué : ${registration.id}`,
                    `${path}.id`,
                );

            }

            registrationIds.add(
                registration.id,
            );

            if (
                registration.seasonId !==
                seasonId
            ) {

                error(
                    "REGISTRATION_SEASON_MISMATCH",
                    `L'inscription ${registration.registrationName} n'appartient pas à la saison importée.`,
                    `${path}.seasonId`,
                );

            }

            if (
                !competitionIds.has(
                    registration.competitionId,
                )
            ) {

                error(
                    "REGISTRATION_COMPETITION_NOT_FOUND",
                    `La compétition de l'inscription ${registration.registrationName} n'existe pas.`,
                    `${path}.competitionId`,
                );

            }

            if (
                !poolIds.has(
                    registration.poolId,
                )
            ) {

                error(
                    "REGISTRATION_POOL_NOT_FOUND",
                    `La poule de l'inscription ${registration.registrationName} n'existe pas.`,
                    `${path}.poolId`,
                );

            }

            /*
             * Le capitaine joue toujours.
             */
            if (
                !registration.playerIds.includes(
                    registration.captainId,
                )
            ) {

                error(
                    "REGISTRATION_CAPTAIN_NOT_PLAYER",
                    `Le capitaine de ${registration.registrationName} n'est pas présent dans playerIds.`,
                    `${path}.captainId`,
                );

            }

            const competition =
                competitionsById.get(
                    registration.competitionId,
                );

            if (competition) {

                const playerCount =
                    registration.playerIds.length;

                switch (
                competition.type
                ) {

                    case "INDIVIDUAL":

                        if (
                            playerCount !== 1
                        ) {

                            error(
                                "REGISTRATION_INDIVIDUAL_PLAYER_COUNT",
                                `${registration.registrationName} doit contenir exactement 1 joueur.`,
                                `${path}.playerIds`,
                            );

                        }

                        break;

                    case "DOUBLES":

                        if (
                            playerCount < 2
                            ||
                            playerCount > 3
                        ) {

                            error(
                                "REGISTRATION_DOUBLES_PLAYER_COUNT",
                                `${registration.registrationName} doit contenir 2 ou 3 joueurs.`,
                                `${path}.playerIds`,
                            );

                        }

                        break;

                    case "TEAM":

                        if (
                            playerCount < 4
                            ||
                            playerCount > 6
                        ) {

                            error(
                                "REGISTRATION_TEAM_PLAYER_COUNT",
                                `${registration.registrationName} doit contenir entre 4 et 6 joueurs.`,
                                `${path}.playerIds`,
                            );

                        }

                        break;

                }

            }

            const uniquePlayerIds =
                new Set(
                    registration.playerIds,
                );

            if (
                uniquePlayerIds.size !==
                registration.playerIds.length
            ) {

                error(
                    "REGISTRATION_DUPLICATE_PLAYER",
                    `${registration.registrationName} contient plusieurs fois le même joueur.`,
                    `${path}.playerIds`,
                );

            }

            const registrationPool =
                poolsById.get(
                    registration.poolId,
                );

            if (
                registrationPool
                &&
                registrationPool.competitionId !==
                registration.competitionId
            ) {

                error(
                    "REGISTRATION_POOL_COMPETITION_MISMATCH",
                    `La poule de ${registration.registrationName} n'appartient pas à sa compétition.`,
                    `${path}.poolId`,
                );

            }

        },
    );

    /*
     * ============================================================
     * JOURNEES
     * ============================================================
     */

    const matchDayIds =
        new Set<string>();

    data.matchDays.forEach(
        (matchDay, index) => {

            const path =
                `matchDays[${index}]`;

            if (
                matchDayIds.has(
                    matchDay.id,
                )
            ) {

                error(
                    "DUPLICATE_MATCHDAY_ID",
                    `ID de journée dupliqué : ${matchDay.id}`,
                    `${path}.id`,
                );

            }

            matchDayIds.add(
                matchDay.id,
            );

            if (
                matchDay.seasonId !==
                seasonId
            ) {

                error(
                    "MATCHDAY_SEASON_MISMATCH",
                    `La journée ${matchDay.id} n'appartient pas à la saison importée.`,
                    `${path}.seasonId`,
                );

            }

            if (
                !competitionIds.has(
                    matchDay.competitionId,
                )
            ) {

                error(
                    "MATCHDAY_COMPETITION_NOT_FOUND",
                    `La compétition de ${matchDay.id} n'existe pas.`,
                    `${path}.competitionId`,
                );

            }

            if (
                !poolIds.has(
                    matchDay.poolId,
                )
            ) {

                error(
                    "MATCHDAY_POOL_NOT_FOUND",
                    `La poule de ${matchDay.id} n'existe pas.`,
                    `${path}.poolId`,
                );

            }

            const matchDayPool =
                poolsById.get(
                    matchDay.poolId,
                );

            if (
                matchDayPool
                &&
                matchDayPool.competitionId !==
                matchDay.competitionId
            ) {

                error(
                    "MATCHDAY_POOL_COMPETITION_MISMATCH",
                    `La poule de ${matchDay.id} n'appartient pas à sa compétition.`,
                    `${path}.poolId`,
                );

            }

        },
    );

    /*
     * ============================================================
     * MATCHS
     * ============================================================
     */

    const matchIds =
        new Set<string>();

    data.matches.forEach(
        (match, index) => {

            const path =
                `matches[${index}]`;

            if (
                matchIds.has(
                    match.id,
                )
            ) {

                error(
                    "DUPLICATE_MATCH_ID",
                    `ID de match dupliqué : ${match.id}`,
                    `${path}.id`,
                );

            }

            matchIds.add(
                match.id,
            );

            if (
                !matchDayIds.has(
                    match.matchDayId,
                )
            ) {

                error(
                    "MATCH_MATCHDAY_NOT_FOUND",
                    `La journée du match ${match.id} n'existe pas.`,
                    `${path}.matchDayId`,
                );

            }

            if (
                match.homeRegistrationId ===
                match.awayRegistrationId
            ) {

                error(
                    "MATCH_SAME_REGISTRATION",
                    `Le match ${match.id} oppose une inscription à elle-même.`,
                    path,
                );

            }

            if (
                !registrationIds.has(
                    match.homeRegistrationId,
                )
            ) {

                error(
                    "MATCH_HOME_REGISTRATION_NOT_FOUND",
                    `L'inscription domicile du match ${match.id} n'existe pas.`,
                    `${path}.homeRegistrationId`,
                );

            }

            if (
                !registrationIds.has(
                    match.awayRegistrationId,
                )
            ) {

                error(
                    "MATCH_AWAY_REGISTRATION_NOT_FOUND",
                    `L'inscription extérieure du match ${match.id} n'existe pas.`,
                    `${path}.awayRegistrationId`,
                );

            }

            const matchDay =
                matchDaysById.get(
                    match.matchDayId,
                );

            const homeRegistration =
                registrationsById.get(
                    match.homeRegistrationId,
                );

            const awayRegistration =
                registrationsById.get(
                    match.awayRegistrationId,
                );

            if (
                matchDay
                &&
                homeRegistration
                &&
                (
                    homeRegistration.competitionId !==
                    matchDay.competitionId
                    ||
                    homeRegistration.poolId !==
                    matchDay.poolId
                )
            ) {

                error(
                    "MATCH_HOME_CONTEXT_MISMATCH",
                    `L'inscription domicile du match ${match.id} n'appartient pas à la compétition/poule de la journée.`,
                    `${path}.homeRegistrationId`,
                );

            }

            if (
                matchDay
                &&
                awayRegistration
                &&
                (
                    awayRegistration.competitionId !==
                    matchDay.competitionId
                    ||
                    awayRegistration.poolId !==
                    matchDay.poolId
                )
            ) {

                error(
                    "MATCH_AWAY_CONTEXT_MISMATCH",
                    `L'inscription extérieure du match ${match.id} n'appartient pas à la compétition/poule de la journée.`,
                    `${path}.awayRegistrationId`,
                );

            }

        },
    );

    const playersByMatchDay =
        new Map<
            string,
            Set<string>
        >();

    data.matches.forEach(
        (match, index) => {

            const used =
                playersByMatchDay.get(
                    match.matchDayId,
                )
                ??
                new Set<string>();

            const registrationIds = [
                match.homeRegistrationId,
                match.awayRegistrationId,
            ];

            for (
                const registrationId
                of registrationIds
            ) {

                if (
                    used.has(
                        registrationId,
                    )
                ) {

                    error(
                        "MATCH_REGISTRATION_DUPLICATE_IN_MATCHDAY",
                        `L'inscription ${registrationId} participe plusieurs fois à la journée ${match.matchDayId}.`,
                        `matches[${index}]`,
                    );

                }

                used.add(
                    registrationId,
                );

            }

            playersByMatchDay.set(
                match.matchDayId,
                used,
            );

        },
    );

    return {

        valid:
            !issues.some(
                issue =>
                    issue.severity ===
                    "ERROR",
            ),

        issues,

        statistics: {

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

        },

    };

}