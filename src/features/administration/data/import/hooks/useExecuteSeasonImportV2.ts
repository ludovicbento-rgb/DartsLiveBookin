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
    ): Promise<SeasonImportV2ExecutionResult> {

        try {

            setLoading(true);
            setError(null);
            setResult(null);

            const result =
                await executeSeasonImportV2(
                    data,
                );

            setResult(
                result,
            );

            return result;

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

            setLoading(false);

        }

    }

    function reset() {

        setResult(null);
        setError(null);

    }

    return {

        result,

        loading,

        error,

        execute,

        reset,

    };

}