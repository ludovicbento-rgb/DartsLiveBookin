import type {
    SeasonImportV2File,
} from "../model/season-import-v2.types";

import type {
    SeasonImportIssue,
} from "../model/season-import.types";

export interface SeasonImportV2ValidationResult {

    valid: boolean;

    issues:
    SeasonImportIssue[];

}

function isValidDate(
    value: string,
): boolean {

    /*
     * 1. Vérification du format YYYY-MM-DD
     */
    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            value,
        )
    ) {

        return false;

    }

    /*
     * 2. Extraction année / mois / jour
     *
     * "2026-10-12"
     *
     * devient :
     *
     * year  = 2026
     * month = 10
     * day   = 12
     */
    const [
        year,
        month,
        day,
    ] =
        value
            .split("-")
            .map(Number);

    /*
     * 3. Construction d'une vraie Date JavaScript
     *
     * Attention :
     * les mois JS commencent à 0.
     *
     * janvier = 0
     * février = 1
     * ...
     * octobre = 9
     */
    const date =
        new Date(
            year,
            month - 1,
            day,
        );

    /*
     * 4. Vérification que JavaScript
     * n'a pas corrigé automatiquement
     * une date impossible.
     */
    return (
        date.getFullYear() === year
        &&
        date.getMonth() === month - 1
        &&
        date.getDate() === day
    );

}

export function validateSeasonImportV2(
    data: SeasonImportV2File,
): SeasonImportV2ValidationResult {

    const issues:
        SeasonImportIssue[] = [];

    function error(
        code: string,
        message: string,
        path?: string,
    ) {

        issues.push({

            severity:
                "ERROR",

            code,

            message,

            path,

        });

    }

    /*
     * ============================================================
     * ENTETE
     * ============================================================
     */

    if (
        data.schemaVersion !== 2
    ) {

        error(
            "IMPORT_V2_SCHEMA_INVALID",
            "Le fichier doit utiliser schemaVersion 2.",
            "schemaVersion",
        );

    }

    if (
        data.scope !== "POOL"
        &&
        data.scope !== "MATCHES"
    ) {

        error(
            "IMPORT_V2_SCOPE_INVALID",
            "Le périmètre doit être POOL ou MATCHES.",
            "scope",
        );

    }

    if (!data.seasonId) {

        error(
            "IMPORT_V2_SEASON_REQUIRED",
            "seasonId est obligatoire.",
            "seasonId",
        );

    }

    if (!data.competitionId) {

        error(
            "IMPORT_V2_COMPETITION_REQUIRED",
            "competitionId est obligatoire.",
            "competitionId",
        );

    }

    /*
     * ============================================================
     * MATCHES
     * ============================================================
     */

    const matchIds =
        new Set<string>();

    for (
        const [
            index,
            match,
        ]
        of data.matches.entries()
    ) {

        const path =
            `matches[${index}]`;

        if (!match.id) {

            error(
                "IMPORT_V2_MATCH_ID_REQUIRED",
                "L'ID du match est obligatoire.",
                `${path}.id`,
            );

        }

        if (
            matchIds.has(
                match.id,
            )
        ) {

            error(
                "IMPORT_V2_DUPLICATE_MATCH_ID",
                `Le match ${match.id} est présent plusieurs fois.`,
                `${path}.id`,
            );

        }

        matchIds.add(
            match.id,
        );

        if (!match.matchDayId) {

            error(
                "IMPORT_V2_MATCHDAY_REQUIRED",
                `Le match ${match.id} n'a pas de journée.`,
                `${path}.matchDayId`,
            );

        }

        if (
            !match.homeRegistrationId
            ||
            !match.awayRegistrationId
        ) {

            error(
                "IMPORT_V2_MATCH_REGISTRATIONS_REQUIRED",
                `Le match ${match.id} doit avoir deux inscriptions.`,
                path,
            );

        }

        if (
            match.homeRegistrationId ===
            match.awayRegistrationId
        ) {

            error(
                "IMPORT_V2_MATCH_SAME_REGISTRATION",
                `Le match ${match.id} oppose une inscription à elle-même.`,
                path,
            );

        }

        if (
            match.playStatus !== "TO_PLAY"
            &&
            match.playStatus !== "PLAYED"
        ) {

            error(
                "IMPORT_V2_PLAY_STATUS_INVALID",
                `Le statut sportif du match ${match.id} est invalide.`,
                `${path}.playStatus`,
            );

        }

    }

    /*
     * ============================================================
     * POOL
     * ============================================================
     */

    if (
        data.scope === "POOL"
    ) {

        if (!data.pool.id) {

            error(
                "IMPORT_V2_POOL_ID_REQUIRED",
                "L'ID de la poule est obligatoire.",
                "pool.id",
            );

        }

        if (
            data.pool.order < 1
        ) {

            error(
                "IMPORT_V2_POOL_ORDER_INVALID",
                "L'ordre de la poule doit être supérieur ou égal à 1.",
                "pool.order",
            );

        }

        /*
         * --------------------------------------------------------
         * INSCRIPTIONS
         * --------------------------------------------------------
         */

        const registrationIds =
            new Set<string>();

        for (
            const [
                index,
                registration,
            ]
            of data.registrations.entries()
        ) {

            const path =
                `registrations[${index}]`;

            if (
                registrationIds.has(
                    registration.id,
                )
            ) {

                error(
                    "IMPORT_V2_DUPLICATE_REGISTRATION_ID",
                    `L'inscription ${registration.id} est dupliquée.`,
                    `${path}.id`,
                );

            }

            registrationIds.add(
                registration.id,
            );

            if (
                !registration.playerIds.includes(
                    registration.captainId,
                )
            ) {

                error(
                    "IMPORT_V2_CAPTAIN_NOT_PLAYER",
                    `Le capitaine de ${registration.registrationName} doit être joueur.`,
                    `${path}.captainId`,
                );

            }

            const uniquePlayers =
                new Set(
                    registration.playerIds,
                );

            if (
                uniquePlayers.size !==
                registration.playerIds.length
            ) {

                error(
                    "IMPORT_V2_DUPLICATE_PLAYER",
                    `${registration.registrationName} contient un joueur en double.`,
                    `${path}.playerIds`,
                );

            }

            const count =
                registration.playerIds.length;

            switch (
            data.competitionType
            ) {

                case "INDIVIDUAL":

                    if (count !== 1) {

                        error(
                            "IMPORT_V2_INDIVIDUAL_COUNT",
                            `${registration.registrationName} doit avoir exactement 1 joueur.`,
                            `${path}.playerIds`,
                        );

                    }

                    break;

                case "DOUBLES":

                    if (
                        count < 2
                        ||
                        count > 3
                    ) {

                        error(
                            "IMPORT_V2_DOUBLES_COUNT",
                            `${registration.registrationName} doit avoir 2 ou 3 joueurs.`,
                            `${path}.playerIds`,
                        );

                    }

                    break;

                case "TEAM":

                    if (
                        count < 4
                        ||
                        count > 6
                    ) {

                        error(
                            "IMPORT_V2_TEAM_COUNT",
                            `${registration.registrationName} doit avoir entre 4 et 6 joueurs.`,
                            `${path}.playerIds`,
                        );

                    }

                    break;

            }

        }

        /*
         * --------------------------------------------------------
         * JOURNEES
         * --------------------------------------------------------
         */

        const matchDayIds =
            new Set<string>();

        for (
            const [
                index,
                matchDay,
            ]
            of data.matchDays.entries()
        ) {

            const path =
                `matchDays[${index}]`;

            if (
                matchDayIds.has(
                    matchDay.id,
                )
            ) {

                error(
                    "IMPORT_V2_DUPLICATE_MATCHDAY_ID",
                    `La journée ${matchDay.id} est dupliquée.`,
                    `${path}.id`,
                );

            }

            matchDayIds.add(
                matchDay.id,
            );

            if (
                !Number.isInteger(
                    matchDay.number,
                )
                ||
                matchDay.number < 1
            ) {

                error(
                    "IMPORT_V2_MATCHDAY_NUMBER_INVALID",
                    `Le numéro de ${matchDay.id} est invalide.`,
                    `${path}.number`,
                );

            }

            if (
                !isValidDate(
                    matchDay.officialDate,
                )
            ) {

                error(
                    "IMPORT_V2_MATCHDAY_DATE_INVALID",
                    `La date de ${matchDay.id} doit être une date valide au format YYYY-MM-DD.`,
                    `${path}.officialDate`,
                );

            }

        }

        /*
         * --------------------------------------------------------
         * RELATIONS MATCHS
         * --------------------------------------------------------
         */

        for (
            const [
                index,
                match,
            ]
            of data.matches.entries()
        ) {

            if (
                !matchDayIds.has(
                    match.matchDayId,
                )
            ) {

                error(
                    "IMPORT_V2_MATCHDAY_NOT_IN_POOL",
                    `La journée ${match.matchDayId} du match ${match.id} n'existe pas dans le fichier.`,
                    `matches[${index}].matchDayId`,
                );

            }

            if (
                !registrationIds.has(
                    match.homeRegistrationId,
                )
            ) {

                error(
                    "IMPORT_V2_HOME_NOT_IN_POOL",
                    `L'inscription domicile ${match.homeRegistrationId} n'existe pas dans la poule importée.`,
                    `matches[${index}].homeRegistrationId`,
                );

            }

            if (
                !registrationIds.has(
                    match.awayRegistrationId,
                )
            ) {

                error(
                    "IMPORT_V2_AWAY_NOT_IN_POOL",
                    `L'inscription extérieure ${match.awayRegistrationId} n'existe pas dans la poule importée.`,
                    `matches[${index}].awayRegistrationId`,
                );

            }

        }

        /*
 * ============================================================
 * UNE INSCRIPTION = UN MATCH MAXIMUM PAR JOURNEE
 * ============================================================
 */

        const registrationsByMatchDay =
            new Map<
                string,
                Set<string>
            >();

        for (
            const [
                index,
                match,
            ]
            of data.matches.entries()
        ) {

            const usedRegistrations =
                registrationsByMatchDay.get(
                    match.matchDayId,
                )
                ??
                new Set<string>();

            const registrations = [

                match.homeRegistrationId,

                match.awayRegistrationId,

            ];

            for (
                const registrationId
                of registrations
            ) {

                if (
                    usedRegistrations.has(
                        registrationId,
                    )
                ) {

                    error(
                        "IMPORT_V2_REGISTRATION_DUPLICATE_IN_MATCHDAY",
                        `L'inscription ${registrationId} participe plusieurs fois à la journée ${match.matchDayId}.`,
                        `matches[${index}]`,
                    );

                }

                usedRegistrations.add(
                    registrationId,
                );

            }

            registrationsByMatchDay.set(
                match.matchDayId,
                usedRegistrations,
            );

        }

    }

    return {

        valid:
            !issues.some(
                issue =>
                    issue.severity ===
                    "ERROR",
            ),

        issues,

    };

}