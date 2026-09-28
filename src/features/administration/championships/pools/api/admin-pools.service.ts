import {
    createPool,
    getPoolsByCompetition,
    updatePool,
} from "@/entities/pool";

import type {
    Pool,
} from "@/entities/pool";

import type {
    AdminPoolRequest,
} from "../model/admin-pool.types";

function validatePool(
    request: AdminPoolRequest,
): void {

    if (
        request.competitionId.trim() === ""
    ) {

        throw new Error(
            "POOL_COMPETITION_REQUIRED",
        );

    }

    if (
        request.name.trim() === ""
    ) {

        throw new Error(
            "POOL_NAME_REQUIRED",
        );

    }

    if (
        !Number.isInteger(
            request.order,
        )
        ||
        request.order < 0
    ) {

        throw new Error(
            "POOL_ORDER_INVALID",
        );

    }

}

export async function loadAdminPools(
    competitionId: string,
): Promise<Pool[]> {

    if (!competitionId) {

        return [];

    }

    const pools =
        await getPoolsByCompetition(
            competitionId,
        );

    return [...pools].sort(
        (a, b) => {

            const orderDifference =
                a.order -
                b.order;

            if (
                orderDifference !== 0
            ) {

                return orderDifference;

            }

            return a.name.localeCompare(
                b.name,
                "fr",
            );

        },
    );

}

export async function createAdminPool(
    request: AdminPoolRequest,
): Promise<string> {

    validatePool(
        request,
    );

    return createPool({

        competitionId:
            request.competitionId,

        name:
            request.name.trim(),

        order:
            request.order,

        active:
            request.active,

    });

}

export async function updateAdminPool(

    poolId: string,

    request: AdminPoolRequest,

): Promise<void> {

    validatePool(
        request,
    );

    await updatePool(

        poolId,

        {

            name:
                request.name.trim(),

            order:
                request.order,

            active:
                request.active,

        },

    );

}