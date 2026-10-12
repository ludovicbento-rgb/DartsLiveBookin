import {
    useState,
} from "react";

import type {
    Season,
} from "@/entities/season";

import type {
    SeasonExportFile,
} from "../model/season-export.types";

import {
    buildSeasonExport,
} from "../api/export-season.service";

export function useSeasonExport() {

    const [
        data,
        setData,
    ] = useState<SeasonExportFile | null>(
        null,
    );

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

    async function prepare(
        season: Season,
    ): Promise<SeasonExportFile> {

        try {

            setLoading(true);
            setError(null);

            const result =
                await buildSeasonExport(
                    season,
                );

            setData(
                result,
            );

            return result;

        }
        catch (error) {

            console.error(
                "SEASON_EXPORT_PREPARE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "SEASON_EXPORT_FAILED";

            setError(
                message,
            );

            throw error;

        }
        finally {

            setLoading(false);

        }

    }

    function download(
        season: Season,
        exportData:
            SeasonExportFile,
    ): void {

        const json =
            JSON.stringify(
                exportData,
                null,
                2,
            );

        const blob =
            new Blob(
                [
                    json,
                ],
                {
                    type:
                        "application/json",
                },
            );

        const url =
            URL.createObjectURL(
                blob,
            );

        const safeName =
            season.name
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    "",
                )
                .replace(
                    /[^a-zA-Z0-9]+/g,
                    "-",
                )
                .replace(
                    /^-+|-+$/g,
                    "",
                )
                .toLowerCase();

        const link =
            document.createElement(
                "a",
            );

        link.href =
            url;

        link.download =
            `dartslive-bookin-${safeName}.json`;

        document.body.appendChild(
            link,
        );

        link.click();

        document.body.removeChild(
            link,
        );

        URL.revokeObjectURL(
            url,
        );

    }

    function reset() {

        setData(null);
        setError(null);

    }

    return {

        data,

        prepare,

        download,

        loading,

        error,

        reset,

    };

}