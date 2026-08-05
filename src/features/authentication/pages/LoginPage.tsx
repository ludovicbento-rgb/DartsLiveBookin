import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import { AppLayout } from "@/app/layouts/AppLayout";

import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
    return (
        <AppLayout>

            <Card
                sx={{
                    maxWidth: 520,
                    mx: "auto",
                    mt: 6,
                }}
            >
                <CardContent>

                    <Typography
                        variant="h4"
                        gutterBottom
                    >
                        Connexion
                    </Typography>

                    <LoginForm />

                </CardContent>

            </Card>

        </AppLayout>
    );
}