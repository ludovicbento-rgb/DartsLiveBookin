import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard, PageTitle } from "@/shared/ui";
import { useNavigate } from "react-router-dom";
import { ActivateAccountForm } from "../components/ActivateAccountForm";

import { useActivation } from "../hooks/useActivation";

import type {
    ActivationFormValues,
} from "../validation/activation.schema";

export function ActivateAccountPage() {

    // Hooks
    const navigate = useNavigate();
    const activation =
        useActivation();

    // Callbacks

    async function handleSubmit(
        values: ActivationFormValues,
    ) {

        await activation.activate(values);

        navigate("/dashboard");

    }

    // Render

    return (

        <AppLayout>

            <AppCard>

                <Stack spacing={4}>

                    <Stack
                        spacing={1}
                        sx={{
                            textAlign: "center",
                        }}
                    >

                        <PageTitle>

                            Activation du compte

                        </PageTitle>

                        <Typography
                            color="text.secondary"
                        >

                            Associez votre licence
                            Dartslive à votre compte.

                        </Typography>

                    </Stack>

                    <ActivateAccountForm
                        onSubmit={handleSubmit}
                        loading={
                            activation.loading
                        }
                    />

                    {

                        activation.error && (

                            <Typography
                                color="error"
                                sx={{
                                    textAlign:
                                        "center",
                                }}
                            >

                                {activation.error}

                            </Typography>

                        )

                    }

                </Stack>

            </AppCard>

        </AppLayout>

    );

}

export default ActivateAccountPage;