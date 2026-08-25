import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard, PageTitle } from "@/shared/ui";

import { LoginForm } from "../components";
import { useAuth } from "../hooks/useAuth";
import { getFirebaseErrorMessage } from "../utils/firebase-error";

import type { LoginFormValues } from "../validation/login.schema";

export function LoginPage() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(values: LoginFormValues) {
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

    return (
        <AppLayout>
            <AppCard>
                <Stack spacing={4}>
                    <PageTitle>
                        Connexion
                    </PageTitle>

                    <Typography
                        color="text.secondary"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        Connectez-vous avec votre compte DartsLive Bookin.
                    </Typography>

                    <LoginForm
                        loading={loading}
                        error={error}
                        onSubmit={handleSubmit}
                    />
                </Stack>
            </AppCard>
        </AppLayout>
    );
}

export default LoginPage;