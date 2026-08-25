import { useState } from "react";

import { activateAccount } from "../api/activation.service";

import type {
    ActivationFormValues,
} from "../validation/activation.schema";

export function useActivation() {

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function activate(
        values: ActivationFormValues,
    ) {

        setLoading(true);
        setError(null);

        try {

            await activateAccount(values);

        } catch (e) {

            if (e instanceof Error) {

                switch (e.message) {

                    case "LICENSE_NOT_FOUND":

                        setError(
                            "Numéro de licence introuvable.",
                        );

                        break;

                    case "ACCOUNT_ALREADY_ACTIVATED":

                        setError(
                            "Ce compte est déjà activé.",
                        );

                        break;

                    case "ACCOUNT_BLOCKED":

                        setError(
                            "Ce compte est bloqué.",
                        );

                        break;

                    case "EMAIL_EXISTS":
                    case "auth/email-already-in-use":
                        setError("Cette adresse e-mail est déjà utilisée.");
                        break;

                    case "auth/invalid-email":
                        setError("Adresse e-mail invalide.");
                        break;

                    case "auth/weak-password":
                        setError("Mot de passe trop faible.");
                        break;

                    default:

                        setError(
                            "Une erreur est survenue.",
                        );

                }

            }

            throw e;

        } finally {

            setLoading(false);

        }

    }

    return {

        activate,

        loading,

        error,

    };

}