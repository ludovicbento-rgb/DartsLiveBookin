import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    deleteAvailabilityRule,
} from "@/entities/availability-rule";

export async function deleteAvailabilityRuleCommand(

    ruleId: string,

): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    await deleteAvailabilityRule(
        ruleId,
    );

}