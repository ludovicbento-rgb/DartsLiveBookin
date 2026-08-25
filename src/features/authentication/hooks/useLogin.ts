import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./useAuth";
import { getFirebaseErrorMessage } from "../utils/firebase-error";

import type { LoginFormValues } from "../validation/login.schema";

export function useLogin() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function login(values: LoginFormValues) {
        setLoading(true);
        setError("");

        try {
            await auth.login(values.email, values.password);

            navigate("/dashboard");
        } catch (e) {
            const code =
                typeof e === "object" &&
                    e !== null &&
                    "code" in e
                    ? String((e as { code: unknown }).code)
                    : "";

            setError(getFirebaseErrorMessage(code));
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        login,
    };
}