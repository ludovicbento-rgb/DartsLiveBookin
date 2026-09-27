import {
    useState,
} from "react";

import {
    activateAdminSeason,
    createAdminSeason,
    updateAdminSeason,
} from "../api/admin-seasons.service";

import type {
    AdminSeasonRequest,
} from "../model/admin-season.types";

export function useSaveAdminSeason() {

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

    async function execute<T>(
        action: () => Promise<T>,
    ): Promise<T> {

        try {

            setLoading(true);
            setError(null);

            return await action();

        }
        catch (error) {

            console.error(
                "ADMIN_SEASON_OPERATION_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "SEASON_OPERATION_FAILED";

            setError(
                message,
            );

            throw error;

        }
        finally {

            setLoading(false);

        }

    }

    function create(
        request: AdminSeasonRequest,
    ) {

        return execute(
            () =>
                createAdminSeason(
                    request,
                ),
        );

    }

    function update(
        seasonId: string,
        request: AdminSeasonRequest,
    ) {

        return execute(
            () =>
                updateAdminSeason(
                    seasonId,
                    request,
                ),
        );

    }

    function activate(
        seasonId: string,
    ) {

        return execute(
            () =>
                activateAdminSeason(
                    seasonId,
                ),
        );

    }

    function resetError() {

        setError(null);

    }

    return {

        create,

        update,

        activate,

        loading,

        error,

        resetError,

    };

}