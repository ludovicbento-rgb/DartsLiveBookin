import {
    activateUser,
    getUserByActivationLicense,
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

    const email =
        values.email
            .trim()
            .toLowerCase();

    const licenseNumber =
        values.licenseNumber.trim();

    /*
     * Étape 1
     *
     * Création du compte Firebase.
     *
     * createUserWithEmailAndPassword()
     * authentifie immédiatement l'utilisateur.
     */
    const firebaseUser =
        await authService.register({

            email,

            password:
                values.password,

        });

    try {

        /*
         * Étape 2
         *
         * Maintenant que Firebase Auth possède
         * un utilisateur connecté, nos règles
         * Firestore autorisent la lecture.
         */
        const player =
            await getUserByActivationLicense(
                licenseNumber,
            );

        /*
         * Étape 3
         *
         * Vérification :
         * - licence existante
         * - compte non activé
         * - joueur ACTIVE
         */
        validateActivation(
            player,
        );

        /*
         * TypeScript ne sait pas forcément que
         * validateActivation() garantit player.
         */
        if (!player) {

            throw new Error(
                "LICENSE_NOT_FOUND",
            );

        }

        /*
         * Étape 4
         *
         * Association du compte Firebase au
         * joueur préchargé.
         */
        await activateUser(

            player.id,

            firebaseUser.uid,

            email,

        );

        /*
         * Étape 5
         *
         * Retour du profil activé.
         */
        return {

            ...player,

            firebaseUid:
                firebaseUser.uid,

            email,

            accountActivated:
                true,

        };

    }
    catch (error) {

        /*
         * Quelque chose a échoué APRÈS
         * la création Firebase Auth.
         *
         * On supprime donc le compte créé afin
         * de ne jamais laisser de compte
         * Firebase orphelin.
         */
        try {

            await authService
                .deleteCurrentUser();

        }
        catch (rollbackError) {

            console.error(
                "ACTIVATION_ROLLBACK_FAILED",
                rollbackError,
            );

        }

        throw error;

    }

}