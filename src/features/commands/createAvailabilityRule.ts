import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    createAvailabilityRule,
    type CreateAvailabilityRuleInput,
} from "@/entities/availability-rule";

export async function createAvailabilityRuleCommand(

    input: Omit<
        CreateAvailabilityRuleInput,
        "createdByUserId"
    >,

): Promise<string> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    return createAvailabilityRule({

        ...input,

        createdByUserId:
            currentUser.uid,

    });

}