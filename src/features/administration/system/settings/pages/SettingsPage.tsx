import {
    Alert,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import SaveIcon
    from "@mui/icons-material/Save";

import SettingsIcon
    from "@mui/icons-material/Settings";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import type {
    UpdateConfigurationRequest,
} from "@/entities/configuration";

import {
    AdministrationLayout,
} from "@/features/administration/layout/AdministrationLayout";


import {
    useAdminSettings,
} from "../hooks/useAdminSettings";

interface FormState {

    applicationName:
    string;

    currentSeasonId:
    string;

    version:
    string;

}

const EMPTY_FORM:
    FormState = {

    applicationName:
        "",

    currentSeasonId:
        "",

    version:
        "",

};

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "CONFIGURATION_NOT_FOUND":

            return "La configuration système est introuvable.";

        case "SETTINGS_APPLICATION_NAME_REQUIRED":

            return "Le nom de l'application est obligatoire.";

        case "SETTINGS_SEASON_REQUIRED":

            return "La saison courante est obligatoire.";

        case "SETTINGS_RESERVATION_SLOTS_REQUIRED":

            return "Au moins un créneau de réservation est nécessaire.";

        case "SETTINGS_RESERVATION_SLOT_INVALID":

            return "Un créneau de réservation est invalide.";

        case "SETTINGS_VERSION_REQUIRED":

            return "La version affichée est obligatoire.";

        default:

            return error
                ? "Impossible d'enregistrer les paramètres."
                : null;

    }

}

export function SettingsPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    if (!profile) {

        return;

    }

    const settings =
        useAdminSettings();

    const [
        form,
        setForm,
    ] =
        useState<FormState>(
            EMPTY_FORM,
        );

    /*
     * ============================================================
     * INITIALISATION FORMULAIRE
     * ============================================================
     */

    useEffect(() => {

        if (
            !settings.context
        ) {

            return;

        }

        const configuration =
            settings.context
                .configuration;

        setForm({

            applicationName:
                configuration
                    .applicationName,

            currentSeasonId:
                configuration
                    .currentSeasonId,

            version:
                configuration
                    .version,

        });

    }, [
        settings.context,
    ]);

    /*
     * ============================================================
     * SECURITE
     * ============================================================
     */

    if (
        !profile
        ||
        !profile.roles.administrator
    ) {

        return (

            <AdministrationLayout>

                <Alert severity="error">

                    Vous n'êtes pas autorisé à modifier les paramètres.

                </Alert>

            </AdministrationLayout>

        );

    }

    /*
     * ============================================================
     * SAVE
     * ============================================================
     */

    async function handleSave() {

        if (!profile) {

            return;

        }

        const request:
            UpdateConfigurationRequest = {

            applicationName:
                form.applicationName,

            currentSeasonId:
                form.currentSeasonId,

            version:
                form.version,

        };

        try {

            await settings.save(
                request,
                {
                    id:
                        profile.id,

                    displayName:
                        `${profile.firstname} ${profile.lastname}`.trim(),
                },
            );

        }
        catch {

            /*
             * L'erreur est affichée
             * par le hook.
             */

        }

    }

    const errorMessage =
        getErrorMessage(
            settings.error,
        );

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

                    <SettingsIcon
                        color="primary"
                    />

                    <Stack>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Paramètres

                        </Typography>

                        <Typography
                            color="text.secondary"
                        >

                            Configuration générale de l'application

                        </Typography>

                    </Stack>

                </Stack>

                {
                    settings.loading && (

                        <Stack
                            spacing={2}
                            sx={{
                                py: 5,
                                alignItems:
                                    "center",
                            }}
                        >

                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                            >

                                Chargement des paramètres...

                            </Typography>

                        </Stack>

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
                    settings.saved && (

                        <Alert
                            severity="success"
                            onClose={
                                settings.clearSaved
                            }
                        >

                            Les paramètres ont été enregistrés.

                        </Alert>

                    )
                }

                {
                    settings.context
                    &&
                    !settings.loading
                    && (

                        <>

                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                }}
                            >

                                <CardContent>

                                    <Stack spacing={3}>

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >

                                            Application

                                        </Typography>

                                        <Divider />

                                        <TextField
                                            fullWidth
                                            label="Nom de l'application"
                                            value={
                                                form.applicationName
                                            }
                                            disabled={
                                                settings.saving
                                            }
                                            onChange={
                                                event =>
                                                    setForm(
                                                        current => ({
                                                            ...current,
                                                            applicationName:
                                                                event.target.value,
                                                        }),
                                                    )
                                            }
                                        />

                                        <TextField
                                            fullWidth
                                            label="Version affichée"
                                            value={
                                                form.version
                                            }
                                            disabled={
                                                settings.saving
                                            }
                                            onChange={
                                                event =>
                                                    setForm(
                                                        current => ({
                                                            ...current,
                                                            version:
                                                                event.target.value,
                                                        }),
                                                    )
                                            }
                                        />

                                    </Stack>

                                </CardContent>

                            </Card>

                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                }}
                            >

                                <CardContent>

                                    <Stack spacing={3}>

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >

                                            Championnat

                                        </Typography>

                                        <Divider />

                                        <FormControl
                                            fullWidth
                                            disabled={
                                                settings.saving
                                            }
                                        >

                                            <InputLabel
                                                id="settings-season-label"
                                            >

                                                Saison courante

                                            </InputLabel>

                                            <Select
                                                labelId="settings-season-label"
                                                label="Saison courante"
                                                value={
                                                    form.currentSeasonId
                                                }
                                                onChange={
                                                    event =>
                                                        setForm(
                                                            current => ({
                                                                ...current,
                                                                currentSeasonId:
                                                                    event.target.value,
                                                            }),
                                                        )
                                                }
                                            >

                                                {
                                                    settings
                                                        .context
                                                        .seasons
                                                        .map(
                                                            season => (

                                                                <MenuItem
                                                                    key={
                                                                        season.id
                                                                    }
                                                                    value={
                                                                        season.id
                                                                    }
                                                                >

                                                                    {
                                                                        season.name
                                                                    }

                                                                    {
                                                                        season.active
                                                                            ? " — active"
                                                                            : ""
                                                                    }

                                                                </MenuItem>

                                                            ),
                                                        )
                                                }

                                            </Select>

                                        </FormControl>

                                    </Stack>

                                </CardContent>

                            </Card>

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={
                                    <SaveIcon />
                                }
                                disabled={
                                    settings.saving
                                }
                                onClick={() => {

                                    void handleSave();

                                }}
                            >

                                {
                                    settings.saving
                                        ? "Enregistrement..."
                                        : "Enregistrer les paramètres"
                                }

                            </Button>

                        </>

                    )
                }

            </Stack>

        </AdministrationLayout>

    );

}

export default SettingsPage;