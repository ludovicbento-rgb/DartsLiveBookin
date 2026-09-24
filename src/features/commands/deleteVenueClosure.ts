import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    deleteVenueClosure,
} from "@/entities/venue-closure";

export async function deleteVenueClosureCommand(
    closureId: string,
): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    await deleteVenueClosure(
        closureId,
    );

}