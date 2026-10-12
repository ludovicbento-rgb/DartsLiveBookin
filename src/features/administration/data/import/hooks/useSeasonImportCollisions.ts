import {
    useState,
} from "react";

import type {
    SeasonImportCollisionResult,
    SeasonImportFile,
} from "../model/season-import.types";

import {
    checkSeasonImportCollisions,
} from "../api/check-season-import-collisions";

export function useSeasonImportCollisions() {

    const [
        result,
        setResult,
    ] = useState<SeasonImportCollisionResult | null>(
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

    async function check(
        data: SeasonImportFile,
    ): Promise<SeasonImportCollisionResult> {

        try {

            setLoading(true);
            setError(null);
            setResult(null);

            const collisionResult =
                await checkSeasonImportCollisions(
                    data,
                );

            setResult(
                collisionResult,
            );

            return collisionResult;

        }
        catch (error) {

            console.error(
                "SEASON_IMPORT_COLLISION_CHECK_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "IMPORT_COLLISION_CHECK_FAILED";

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

        check,

        reset,

    };

}