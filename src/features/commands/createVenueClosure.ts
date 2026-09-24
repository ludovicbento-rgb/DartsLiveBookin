import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    createVenueClosure,
} from "@/entities/venue-closure";

import type {
    CreateVenueClosureInput,
} from "@/entities/venue-closure";

export async function createVenueClosureCommand(

    input: CreateVenueClosureInput,

): Promise<string> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    return createVenueClosure(
        input,
    );

}