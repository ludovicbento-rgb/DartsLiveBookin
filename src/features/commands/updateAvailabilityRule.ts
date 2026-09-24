import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    updateAvailabilityRule,
} from "@/entities/availability-rule";

import type {
    UpdateAvailabilityRuleInput,
} from "@/entities/availability-rule";

export async function updateAvailabilityRuleCommand(

    ruleId: string,

    input: Omit<
        UpdateAvailabilityRuleInput,
        "updatedByUserId"
    >,

): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    await updateAvailabilityRule(

        ruleId,

        {

            ...input,

            updatedByUserId:
                currentUser.uid,

        },

    );

}