import {
    Alert,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import BuildIcon
    from "@mui/icons-material/Build";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    AdministrationLayout,
} from "@/features/administration/layout/AdministrationLayout";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    useConfiguration,
} from "@/features/configuration/hooks/useConfiguration";

import {
    useAdminMaintenance,
} from "../hooks/useAdminMaintenance";

const DEFAULT_MESSAGE =
    "Une maintenance est actuellement en cours. L'application sera de nouveau disponible prochainement.";

export function MaintenanceAdminPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const {
        configuration,
        loading,
        error:
        configurationError,
    } =
        useConfiguration();

    const maintenance =
        useAdminMaintenance();

    const [
        message,
        setMessage,
    ] =
        useState(
            DEFAULT_MESSAGE,
        );

    useEffect(() => {

        if (
            configuration
                ?.maintenanceMessage
        ) {

            setMessage(
                configuration
                    .maintenanceMessage,
            );

        }

    }, [
        configuration,
    ]);

    if (
        !profile
        ||
        !profile.roles.administrator
    ) {

        return (

            <AdministrationLayout>

                <Alert severity="error">

                    Vous n'êtes pas autorisé à gérer la maintenance.

                </Alert>

            </AdministrationLayout>

        );

    }

    async function handleEnable() {

        if (!profile) {
            return;
        }

        try {

            await maintenance.enable(
                message,
                {
                    id:
                        profile.id,

                    displayName:
                        `${profile.firstname} ${profile.lastname}`.trim(),
                },
            );

        }
        catch {

            // L'erreur est affichée par le hook.

        }

    }

    async function handleDisable() {

        try {

            if (!profile) {
                return;
            }

            await maintenance.disable(
                {
                    id:
                        profile.id,

                    displayName:
                        `${profile.firstname} ${profile.lastname}`.trim(),
                },
            );

        }
        catch {

            // L'erreur est affichée par le hook.

        }

    }

    const errorMessage =

        maintenance.error ===
            "MAINTENANCE_MESSAGE_REQUIRED"

            ? "Le message de maintenance est obligatoire."

            : maintenance.error

                ? "Impossible de modifier le mode maintenance."

                : null;

    return (

        <AdministrationLayout>

            <Stack spacing={3}>

                <Button
                    variant="text"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={() =>
                        navigate(
                            "/administration",
                        )
                    }
                    sx={{
                        alignSelf:
                            "flex-start",
                    }}
                >

                    Retour à l'administration

                </Button>

                <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                        alignItems:
                            "center",
                    }}
                >

                    <BuildIcon
                        color="primary"
                    />

                    <Stack>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Maintenance

                        </Typography>

                        <Typography
                            color="text.secondary"
                        >

                            Disponibilité générale de l'application

                        </Typography>

                    </Stack>

                </Stack>

                {
                    loading && (

                        <Stack
                            spacing={2}
                            sx={{
                                alignItems:
                                    "center",

                                py: 5,
                            }}
                        >

                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                            >

                                Chargement...

                            </Typography>

                        </Stack>

                    )
                }

                {
                    configurationError && (

                        <Alert severity="error">

                            Impossible de charger la configuration.

                        </Alert>

                    )
                }

                {
                    errorMessage && (

                        <Alert severity="error">

                            {errorMessage}

                        </Alert>

                    )
                }

                {
                    maintenance.success && (

                        <Alert
                            severity="success"
                            onClose={
                                maintenance
                                    .clearSuccess
                            }
                        >

                            {
                                maintenance.success ===
                                    "MAINTENANCE_ENABLED"

                                    ? "Le mode maintenance est activé."

                                    : "Le mode maintenance est désactivé."
                            }

                        </Alert>

                    )
                }

                {
                    configuration
                    &&
                    !loading
                    && (

                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                            }}
                        >

                            <CardContent>

                                <Stack spacing={3}>

                                    <Stack
                                        direction={{
                                            xs:
                                                "column",

                                            sm:
                                                "row",
                                        }}
                                        spacing={2}
                                        sx={{
                                            justifyContent:
                                                "space-between",

                                            alignItems: {
                                                xs:
                                                    "flex-start",

                                                sm:
                                                    "center",
                                            },
                                        }}
                                    >

                                        <Stack spacing={0.5}>

                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight:
                                                        700,
                                                }}
                                            >

                                                État de l'application

                                            </Typography>

                                            <Typography
                                                color={
                                                    configuration
                                                        .maintenanceMode

                                                        ? "error"

                                                        : "success.main"
                                                }
                                                sx={{
                                                    fontWeight:
                                                        700,
                                                }}
                                            >

                                                {
                                                    configuration
                                                        .maintenanceMode

                                                        ? "● Mode maintenance actif"

                                                        : "● Application disponible"
                                                }

                                            </Typography>

                                        </Stack>

                                    </Stack>

                                    <Divider />

                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        label="Message affiché aux utilisateurs"
                                        value={
                                            message
                                        }
                                        disabled={
                                            maintenance
                                                .saving
                                        }
                                        onChange={
                                            event =>
                                                setMessage(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                        }
                                    />

                                    <Alert severity="info">

                                        Les administrateurs conserveront
                                        l'accès à l'application pendant
                                        la maintenance afin de pouvoir
                                        la désactiver.

                                    </Alert>

                                    {
                                        configuration
                                            .maintenanceMode

                                            ? (

                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    disabled={
                                                        maintenance
                                                            .saving
                                                    }
                                                    onClick={() => {

                                                        void handleDisable();

                                                    }}
                                                >

                                                    {
                                                        maintenance
                                                            .saving

                                                            ? "Désactivation..."

                                                            : "Désactiver le mode maintenance"
                                                    }

                                                </Button>

                                            )

                                            : (

                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    disabled={
                                                        maintenance
                                                            .saving
                                                    }
                                                    onClick={() => {

                                                        void handleEnable();

                                                    }}
                                                >

                                                    {
                                                        maintenance
                                                            .saving

                                                            ? "Activation..."

                                                            : "Activer le mode maintenance"
                                                    }

                                                </Button>

                                            )
                                    }

                                </Stack>

                            </CardContent>

                        </Card>

                    )
                }

            </Stack>

        </AdministrationLayout>

    );

}

export default MaintenanceAdminPage;