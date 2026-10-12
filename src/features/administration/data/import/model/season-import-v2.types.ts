export type SeasonImportV2Scope =
    | "POOL"
    | "MATCHES";

export type SeasonImportV2CompetitionType =
    | "INDIVIDUAL"
    | "DOUBLES"
    | "TEAM";

export type SeasonImportV2PlayStatus =
    | "TO_PLAY"
    | "PLAYED";

export interface SeasonImportV2Pool {

    id: string;

    name: string;

    order: number;

    active: boolean;

}

export type SeasonImportV2Action =
    | "DEPENDENCY"
    | "CREATE"
    | "SKIP"
    | "CONFLICT";

export type SeasonImportV2EntityType =
    | "SEASON"
    | "COMPETITION"
    | "POOL"
    | "REGISTRATION"
    | "MATCHDAY"
    | "MATCH";

export interface SeasonImportV2AnalysisItem {

    entityType:
    SeasonImportV2EntityType;

    id: string;

    label: string;

    action:
    SeasonImportV2Action;

    message?: string;

}

export interface SeasonImportV2AnalysisStatistics {

    dependencies: number;

    creates: number;

    skips: number;

    conflicts: number;

}

export interface SeasonImportV2AnalysisResult {

    valid: boolean;

    scope:
    SeasonImportV2Scope;

    seasonId: string;

    competitionId: string;

    poolId?: string;

    items:
    SeasonImportV2AnalysisItem[];

    issues:
    import("./season-import.types")
    .SeasonImportIssue[];

    statistics:
    SeasonImportV2AnalysisStatistics;

}

export interface SeasonImportV2Registration {

    id: string;

    registrationName: string;

    captainId: string;

    playerIds: string[];

    homeVenueId: string;

    active: boolean;

}

export interface SeasonImportV2MatchDay {

    id: string;

    number: number;

    displayName: string;

    /*
     * ISO 8601 :
     * 2026-10-12
     */
    officialDate: string;

    active: boolean;

}

export interface SeasonImportV2Match {

    id: string;

    matchDayId: string;

    homeRegistrationId: string;

    awayRegistrationId: string;

    /*
     * TO_PLAY :
     * match futur.
     *
     * PLAYED :
     * historique déjà joué.
     */
    playStatus:
    SeasonImportV2PlayStatus;

}

/*
 * ============================================================
 * IMPORT D'UNE POULE
 * ============================================================
 */

export interface SeasonImportV2PoolFile {

    schemaVersion: 2;

    scope: "POOL";

    /*
     * Ces deux documents doivent déjà exister.
     */
    seasonId: string;

    competitionId: string;

    /*
     * Information permettant également
     * de vérifier la compétition existante.
     */
    competitionType:
    SeasonImportV2CompetitionType;

    pool:
    SeasonImportV2Pool;

    registrations:
    SeasonImportV2Registration[];

    matchDays:
    SeasonImportV2MatchDay[];

    matches:
    SeasonImportV2Match[];

}

/*
 * ============================================================
 * IMPORT UNIQUEMENT DES MATCHS
 * ============================================================
 */

export interface SeasonImportV2MatchesFile {

    schemaVersion: 2;

    scope: "MATCHES";

    /*
     * Saison / compétition / poule
     * doivent déjà exister.
     */
    seasonId: string;

    competitionId: string;

    poolId: string;

    matches:
    SeasonImportV2Match[];

}

export type SeasonImportV2File =
    | SeasonImportV2PoolFile
    | SeasonImportV2MatchesFile;

export interface SeasonImportV2ExecutionStatistics {

    created: number;

    skipped: number;

    dependencies: number;

}

export interface SeasonImportV2ExecutionResult {

    scope:
    SeasonImportV2Scope;

    seasonId: string;

    competitionId: string;

    poolId?: string;

    statistics:
    SeasonImportV2ExecutionStatistics;

}