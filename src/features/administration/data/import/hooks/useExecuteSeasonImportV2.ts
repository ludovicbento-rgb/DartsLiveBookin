import {
    useState,
} from "react";

import type {
    SeasonImportV2ExecutionResult,
    SeasonImportV2File,
} from "../model/season-import-v2.types";

import {
    executeSeasonImportV2,
} from "../api/execute-season-import-v2";

import {
    safeCreateAuditLog,
} from "@/entities/audit-log";

import type {
    AuditUser,
} from "@/entities/audit-log";

export function useExecuteSeasonImportV2() {

    const [
        result,
        setResult,
    ] =
        useState<SeasonImportV2ExecutionResult | null>(
            null,
        );

    const [
        loading,
        setLoading,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );

    async function execute(
        data:
            SeasonImportV2File,
        user:
            AuditUser,
    ): Promise<SeasonImportV2ExecutionResult> {

        try {

            setLoading(
                true,
            );

            setError(
                null,
            );

            setResult(
                null,
            );

            /*
             * ====================================================
             * IMPORT
             * ====================================================
             */

            const importResult =
                await executeSeasonImportV2(
                    data,
                );

            /*
             * ====================================================
             * AUDIT
             * ====================================================
             *
             * On ne journalise que si l'import
             * a réellement créé des documents.
             */

            if (
                importResult
                    .statistics
                    .created >
                0
            ) {

                await safeCreateAuditLog({

                    action:
                        "IMPORT_V2_EXECUTED",

                    entityType:
                        "IMPORT",

                    entityId:
                        importResult.poolId
                        ??
                        importResult.competitionId,

                    userId:
                        user.id,

                    userDisplayName:
                        user.displayName,

                    metadata: {

                        scope:
                            importResult.scope,

                        seasonId:
                            importResult.seasonId,

                        competitionId:
                            importResult.competitionId,

                        poolId:
                            importResult.poolId,

                        created:
                            importResult
                                .statistics
                                .created,

                        skipped:
                            importResult
                                .statistics
                                .skipped,

                        dependencies:
                            importResult
                                .statistics
                                .dependencies,

                    },

                });

            }

            setResult(
                importResult,
            );

            return importResult;

        }
        catch (error) {

            console.error(
                "SEASON_IMPORT_V2_EXECUTION_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "IMPORT_V2_EXECUTION_FAILED";

            setError(
                message,
            );

            throw error;

        }
        finally {

            setLoading(
                false,
            );

        }

    }

    function reset() {

        setResult(
            null,
        );

        setError(
            null,
        );

    }

    return {

        result,

        loading,

        error,

        execute,

        reset,

    };

}