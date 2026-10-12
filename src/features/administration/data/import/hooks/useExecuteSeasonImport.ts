import {
    useState,
} from "react";

import type {
    SeasonImportFile,
    SeasonImportExecutionResult,
} from "../model/season-import.types";

import {
    executeSeasonImport,
} from "../api/execute-season-import";

import {
    safeCreateAuditLog,
} from "@/entities/audit-log";

import type {
    AuditUser,
} from "@/entities/audit-log";

export function useExecuteSeasonImport() {

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    );

    const [
        result,
        setResult,
    ] = useState<SeasonImportExecutionResult | null>(
        null,
    );

    async function execute(
        data: SeasonImportFile,
        user: AuditUser,
    ): Promise<SeasonImportExecutionResult> {

        try {

            setLoading(true);
            setError(null);
            setResult(null);

            const importResult =
                await executeSeasonImport(
                    data,
                );

            await safeCreateAuditLog({

                action:
                    "IMPORT_V1_EXECUTED",

                entityType:
                    "IMPORT",

                entityId:
                    data.season.id,

                userId:
                    user.id,

                userDisplayName:
                    user.displayName,

                metadata: {

                    scope:
                        "SEASON",

                    seasonId:
                        data.season.id,

                },

            });

            setResult(
                importResult,
            );

            return importResult;

        }
        catch (error) {

            console.error(
                "SEASON_IMPORT_EXECUTION_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "IMPORT_FAILED";

            setError(
                message,
            );

            throw error;

        }
        finally {

            setLoading(false);

        }

    }

    function reset() {

        setError(null);
        setResult(null);

    }

    return {

        execute,

        loading,

        error,

        result,

        reset,

    };

}