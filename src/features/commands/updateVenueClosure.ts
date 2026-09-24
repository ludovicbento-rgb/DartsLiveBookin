import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    updateVenueClosure,
} from "@/entities/venue-closure";

import type {
    UpdateVenueClosureInput,
} from "@/entities/venue-closure";

export async function updateVenueClosureCommand(

    closureId: string,

    input: UpdateVenueClosureInput,

): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    await updateVenueClosure(

        closureId,

        input,

    );

}