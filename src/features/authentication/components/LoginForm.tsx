import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import { AppButton } from "@/shared/ui/AppButton";
import { AppTextField } from "@/shared/ui/AppTextField";
import { AppPasswordField } from "@/shared/ui/AppPasswordField";
import { AppFormActions } from "@/shared/ui/AppFormActions";

import {
    loginSchema,
    type LoginFormValues,
} from "../validation/login.schema";

interface LoginFormProps {
    loading?: boolean;
    error?: string;
    onSubmit: (values: LoginFormValues) => Promise<void>;
}

export function LoginForm({
    loading = false,
    error,
    onSubmit,
}: LoginFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <AppTextField
                            {...field}
                            label="Adresse e-mail"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <AppPasswordField
                            {...field}
                            label="Mot de passe"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    )}
                />

                <AppFormActions>
                    <AppButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </AppButton>
                </AppFormActions>
            </Stack>
        </form>
    );
}