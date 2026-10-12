import type {
    SeasonImportFile,
    SeasonImportExecutionResult,
} from "../model/season-import.types";

import {
    analyzeSeasonImport,
} from "./analyze-season-import";

import {
    checkSeasonImportCollisions,
} from "./check-season-import-collisions";

import {
    importSeason,
} from "./import-season.service";

export async function executeSeasonImport(
    data: SeasonImportFile,
): Promise<SeasonImportExecutionResult> {

    /*
     * ============================================================
     * REVALIDATION
     * ============================================================
     *
     * On ne fait jamais confiance uniquement
     * à l'analyse effectuée précédemment dans l'UI.
     */

    const validation =
        await analyzeSeasonImport(
            data,
        );

    if (!validation.valid) {

        throw new Error(
            "IMPORT_VALIDATION_FAILED",
        );

    }

    /*
     * ============================================================
     * COLLISIONS
     * ============================================================
     */

    const collisionResult =
        await checkSeasonImportCollisions(
            data,
        );

    if (
        collisionResult.hasCollisions
    ) {

        throw new Error(
            "IMPORT_COLLISION",
        );

    }

    /*
     * ============================================================
     * IMPORT
     * ============================================================
     */

    return importSeason(
        data,
    );

}