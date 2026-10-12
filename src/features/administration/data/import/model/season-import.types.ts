import type {
    SeasonExportFile,
} from "../../export/model/season-export.types";

export type SeasonImportFile =
    SeasonExportFile;

export type SeasonImportIssueSeverity =
    | "ERROR"
    | "WARNING";

export interface SeasonImportIssue {

    severity:
    SeasonImportIssueSeverity;

    code: string;

    message: string;

    path?: string;

}

export interface SeasonImportValidationResult {

    valid: boolean;

    issues:
    SeasonImportIssue[];

    statistics: {

        competitions: number;

        pools: number;

        registrations: number;

        matchDays: number;

        matches: number;

    };

}

export interface SeasonImportCollision {

    collection:
    | "seasons"
    | "competitions"
    | "pools"
    | "registrations"
    | "matchdays"
    | "matches";

    id: string;

}

export interface SeasonImportCollisionResult {

    hasCollisions: boolean;

    collisions:
    SeasonImportCollision[];

}

export interface SeasonImportExecutionResult {

    seasonId: string;

    competitions: number;

    pools: number;

    registrations: number;

    matchDays: number;

    matches: number;

    totalDocuments: number;

}