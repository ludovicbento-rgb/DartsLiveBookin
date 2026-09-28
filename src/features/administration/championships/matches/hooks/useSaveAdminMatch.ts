import {
    useState,
} from "react";

import {
    createAdminMatch,
    updateAdminMatch,
} from "../api/admin-matches.service";

import type {
    AdminMatchRequest,
} from "../model/admin-match.types";

export function useSaveAdminMatch() {

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
                "ADMIN_MATCH_OPERATION_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "MATCH_OPERATION_FAILED";

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
        request: AdminMatchRequest,
    ): Promise<string> {

        return execute(
            () =>
                createAdminMatch(
                    request,
                ),
        );

    }

    function update(
        matchId: string,
        request: AdminMatchRequest,
    ): Promise<void> {

        return execute(
            () =>
                updateAdminMatch(
                    matchId,
                    request,
                ),
        );

    }

    function resetError() {

        setError(null);

    }

    return {

        create,

        update,

        loading,

        error,

        resetError,

    };

}