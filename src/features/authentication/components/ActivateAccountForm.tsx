import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import Button from "@mui/material/Button";

import {
    AppFormActions,
    AppPasswordField,
    AppTextField,
} from "@/shared/ui";

import {
    activationSchema,
    type ActivationFormValues,
} from "../validation/activation.schema";

interface ActivateAccountFormProps {
    onSubmit: (
        values: ActivationFormValues,
    ) => Promise<void>;

    loading?: boolean;
}

export function ActivateAccountForm({
    onSubmit,
    loading = false,
}: ActivateAccountFormProps) {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ActivationFormValues>({
        resolver: zodResolver(
            activationSchema,
        ),

        defaultValues: {

            licenseNumber: "",

            email: "",

            password: "",

            confirmPassword: "",

        },
    });

    return (

        <form
            onSubmit={handleSubmit(
                onSubmit,
            )}
            noValidate
        >

            <Controller
                name="licenseNumber"
                control={control}
                render={({ field }) => (

                    <AppTextField
                        {...field}
                        label="Numéro de licence"
                        error={
                            !!errors.licenseNumber
                        }
                        helperText={
                            errors.licenseNumber
                                ?.message
                        }
                    />

                )}
            />

            <Controller
                name="email"
                control={control}
                render={({ field }) => (

                    <AppTextField
                        {...field}
                        type="email"
                        label="Adresse e-mail"
                        error={!!errors.email}
                        helperText={
                            errors.email?.message
                        }
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
                        error={
                            !!errors.password
                        }
                        helperText={
                            errors.password?.message
                        }
                    />

                )}
            />

            <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (

                    <AppPasswordField
                        {...field}
                        label="Confirmation"
                        error={
                            !!errors.confirmPassword
                        }
                        helperText={
                            errors.confirmPassword
                                ?.message
                        }
                    />

                )}
            />

            <AppFormActions>

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    loading={loading}
                >
                    Activer mon compte
                </Button>

            </AppFormActions>

        </form>

    );

}

export default ActivateAccountForm;