import type {
    SeasonImportFile,
    SeasonImportValidationResult,
} from "../model/season-import.types";

import {
    validateSeasonImport,
} from "./validate-season-import";

import {
    validateImportReferences,
} from "./validate-import-references";

export async function analyzeSeasonImport(
    data: SeasonImportFile,
): Promise<SeasonImportValidationResult> {

    /*
     * Validation interne du fichier.
     */
    const internal =
        validateSeasonImport(
            data,
        );

    /*
     * Si la structure interne est déjà invalide,
     * inutile d'interroger Firestore.
     */
    if (!internal.valid) {

        return internal;

    }

    /*
     * Validation des référentiels externes.
     */
    const externalIssues =
        await validateImportReferences(
            data,
        );

    const issues = [
        ...internal.issues,
        ...externalIssues,
    ];

    return {

        ...internal,

        valid:
            !issues.some(
                issue =>
                    issue.severity ===
                    "ERROR",
            ),

        issues,

    };

}