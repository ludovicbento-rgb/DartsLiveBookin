import { useState } from "react";

import {
    Alert,
    Button,
    Stack,
    TextField,
} from "@mui/material";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    Controller,
    useForm,
} from "react-hook-form";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import {
    loginSchema,
    type LoginFormValues,
} from "../validation/login.schema";

import { getFirebaseErrorMessage } from "../utils/firebase-error";

export function LoginForm() {
    const navigate = useNavigate();

    const auth = useAuth();

    const [error, setError] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(
        data: LoginFormValues,
    ) {
        setError("");

        try {
            await auth.login(
                data.email,
                data.password,
            );

            navigate("/dashboard");
        } catch (e) {
            const message =
                getFirebaseErrorMessage(
                    (e as { code?: string }).code ?? "",
                );

            setError(message);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <Stack spacing={3}>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Adresse email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Mot de passe"
                            type="password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            fullWidth
                        />
                    )}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Connexion..."
                        : "Se connecter"}
                </Button>

            </Stack>

        </form>
    );
}