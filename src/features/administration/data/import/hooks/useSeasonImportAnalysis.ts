import {
    useState,
} from "react";

import type {
    SeasonImportFile,
    SeasonImportValidationResult,
} from "../model/season-import.types";

import {
    analyzeSeasonImport,
} from "../api/analyze-season-import";

export function useSeasonImportAnalysis() {

    const [
        data,
        setData,
    ] = useState<SeasonImportFile | null>(
        null,
    );

    const [
        result,
        setResult,
    ] = useState<SeasonImportValidationResult | null>(
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
            setResult(null);
            setData(null);

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

            /*
             * Le validateur contrôlera ensuite
             * le contenu métier.
             */
            const importData =
                parsed as SeasonImportFile;

            const validation =
                await analyzeSeasonImport(
                    importData,
                );

            setFileName(
                file.name,
            );

            setData(
                importData,
            );

            setResult(
                validation,
            );

        }
        catch (error) {

            console.error(
                "SEASON_IMPORT_ANALYSIS_FAILED",
                error,
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "IMPORT_ANALYSIS_FAILED",
            );

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

    };

}