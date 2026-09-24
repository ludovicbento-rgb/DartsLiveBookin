import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    setVenueClosureActive,
} from "@/entities/venue-closure";

export async function setVenueClosureActiveCommand(

    closureId: string,

    active: boolean,

): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    await setVenueClosureActive(

        closureId,

        active,

    );

}