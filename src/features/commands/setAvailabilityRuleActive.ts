import {
    authService,
} from "@/features/authentication/api/auth.service";

import {
    setAvailabilityRuleActive,
} from "@/entities/availability-rule";

export async function setAvailabilityRuleActiveCommand(

    ruleId: string,

    isActive: boolean,

): Promise<void> {

    const currentUser =
        authService.getCurrentUser();

    if (!currentUser) {

        throw new Error(
            "USER_NOT_CONNECTED",
        );

    }

    await setAvailabilityRuleActive(

        ruleId,

        isActive,

        currentUser.uid,

    );

}