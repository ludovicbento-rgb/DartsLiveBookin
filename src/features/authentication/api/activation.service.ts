import {
    activateUser,
    getUserByLicenseNumber,
    type UserProfile,
} from "@/entities/user";

import { authService } from "./auth.service";

import { validateActivation } from "../utils/activation-validator";

import type {
    ActivationFormValues,
} from "../validation/activation.schema";

export async function activateAccount(
    values: ActivationFormValues,
): Promise<UserProfile> {

    const player =
        await getUserByLicenseNumber(
            values.licenseNumber,
        );

    validateActivation(player);

    if (!player) {
        throw new Error("LICENSE_NOT_FOUND");
    }

    const firebaseUser =
        await authService.register({

            email: values.email,

            password: values.password,

        });

    await activateUser(

        player.id,

        firebaseUser.uid,

        values.email,

    );

    return {

        ...player,

        firebaseUid: firebaseUser.uid,

        email: values.email,

        accountActivated: true,

    };

}