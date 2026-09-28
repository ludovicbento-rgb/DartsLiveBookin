import {
    useState,
} from "react";

import {
    createAdminMatchDay,
    updateAdminMatchDay,
} from "../api/admin-matchdays.service";

import type {
    AdminMatchDayRequest,
} from "../model/admin-matchday.types";

export function useSaveAdminMatchDay() {

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
                "ADMIN_MATCHDAY_OPERATION_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "MATCHDAY_OPERATION_FAILED";

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
        request: AdminMatchDayRequest,
    ) {

        return execute(
            () =>
                createAdminMatchDay(
                    request,
                ),
        );

    }

    function update(
        matchDayId: string,
        request: AdminMatchDayRequest,
    ) {

        return execute(
            () =>
                updateAdminMatchDay(
                    matchDayId,
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