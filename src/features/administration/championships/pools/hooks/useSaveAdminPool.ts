import {
    useState,
} from "react";

import {
    createAdminPool,
    updateAdminPool,
} from "../api/admin-pools.service";

import type {
    AdminPoolRequest,
} from "../model/admin-pool.types";

export function useSaveAdminPool() {

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

    async function create(
        request: AdminPoolRequest,
    ): Promise<string> {

        try {

            setLoading(true);
            setError(null);

            return await createAdminPool(
                request,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_POOL_CREATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "POOL_CREATE_FAILED";

            setError(
                message,
            );

            throw error;

        }
        finally {

            setLoading(false);

        }

    }

    async function update(

        poolId: string,

        request: AdminPoolRequest,

    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);

            await updateAdminPool(
                poolId,
                request,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_POOL_UPDATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "POOL_UPDATE_FAILED";

            setError(
                message,
            );

            throw error;

        }
        finally {

            setLoading(false);

        }

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