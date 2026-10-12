import {
    useState,
} from "react";

import type {
    Competition,
} from "@/entities/competition";

import type {
    Pool,
} from "@/entities/pool";

import type {
    PreparedPoolExport,
} from "../model/pool-export.types";

import {
    preparePoolExport,
} from "../api/prepare-pool-export";

import {
    downloadJson,
} from "../api/download-json";

export function usePoolExport() {

    const [
        prepared,
        setPrepared,
    ] =
        useState<PreparedPoolExport | null>(
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

    async function prepare(
        seasonId: string,
        competition: Competition,
        pool: Pool,
    ): Promise<PreparedPoolExport> {

        try {

            setLoading(true);
            setError(null);

            const result =
                await preparePoolExport(

                    seasonId,

                    competition,

                    pool,

                );

            setPrepared(
                result,
            );

            return result;

        }
        catch (error) {

            console.error(
                "POOL_EXPORT_PREPARE_FAILED",
                error,
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "POOL_EXPORT_FAILED",
            );

            throw error;

        }
        finally {

            setLoading(false);

        }

    }

    function download(
        pool: Pool,
    ): void {

        if (!prepared) {

            return;

        }

        const safeName =
            pool.name
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    "",
                )
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-",
                )
                .replace(
                    /^-+|-+$/g,
                    "",
                );

        downloadJson(

            prepared.data,

            `dartslive-bookin-${safeName}.json`,

        );

    }

    function reset() {

        setPrepared(null);
        setError(null);

    }

    return {

        prepared,

        loading,

        error,

        prepare,

        download,

        reset,

    };

}