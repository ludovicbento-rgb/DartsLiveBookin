import {
    useState,
} from "react";

import {
    analyzeSeasonImportV2,
} from "../api/analyze-season-import-v2";

import type {
    SeasonImportV2AnalysisResult,
    SeasonImportV2File,
} from "../model/season-import-v2.types";

export function useSeasonImportV2Analysis() {

    const [
        data,
        setData,
    ] = useState<SeasonImportV2File | null>(
        null,
    );

    const [
        result,
        setResult,
    ] = useState<SeasonImportV2AnalysisResult | null>(
        null,
    );

    const [
        fileName,
        setFileName,
    ] = useState("");

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

    async function analyzeFile(
        file: File,
    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);
            setData(null);
            setResult(null);

            const text =
                await file.text();

            let parsed:
                unknown;

            try {

                parsed =
                    JSON.parse(
                        text,
                    );

            }
            catch {

                throw new Error(
                    "IMPORT_JSON_INVALID",
                );

            }

            if (
                !parsed
                ||
                typeof parsed !== "object"
            ) {

                throw new Error(
                    "IMPORT_V2_INVALID",
                );

            }

            const candidate =
                parsed as Partial<
                    SeasonImportV2File
                >;

            if (
                candidate.schemaVersion !== 2
            ) {

                throw new Error(
                    "IMPORT_V2_SCHEMA_INVALID",
                );

            }

            if (
                candidate.scope !== "POOL"
                &&
                candidate.scope !== "MATCHES"
            ) {

                throw new Error(
                    "IMPORT_V2_SCOPE_INVALID",
                );

            }

            const data =
                parsed as SeasonImportV2File;

            const analysis =
                await analyzeSeasonImportV2(
                    data,
                );

            setFileName(
                file.name,
            );

            setData(
                data,
            );

            setResult(
                analysis,
            );

        }
        catch (error) {

            console.error(
                "SEASON_IMPORT_V2_ANALYSIS_FAILED",
                error,
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "IMPORT_V2_ANALYSIS_FAILED",
            );

        }
        finally {

            setLoading(false);

        }

    }

    async function reanalyze(): Promise<void> {

        if (!data) {

            return;

        }

        try {

            setLoading(true);
            setError(null);

            const result =
                await analyzeSeasonImportV2(
                    data,
                );

            setResult(
                result,
            );

        }
        catch (error) {

            console.error(
                "SEASON_IMPORT_V2_REANALYSIS_FAILED",
                error,
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "IMPORT_V2_ANALYSIS_FAILED",
            );

            throw error;

        }
        finally {

            setLoading(false);

        }

    }

    function reset() {

        setData(null);
        setResult(null);
        setFileName("");
        setError(null);

    }

    return {

        data,

        result,

        fileName,

        loading,

        error,

        analyzeFile,

        reset,

        reanalyze,

    };

}