import {
    Alert,
    Button,
    Divider,
    Drawer,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import type {
    Season,
} from "@/entities/season";

import type {
    AdminSeasonRequest,
} from "../model/admin-season.types";

interface Props {

    open: boolean;

    season: Season | null;

    loading: boolean;

    error: string | null;

    onClose(): void;

    onSubmit(
        request: AdminSeasonRequest,
    ): Promise<void>;

}

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "SEASON_NAME_REQUIRED":
            return "Le nom de la saison est obligatoire.";

        default:
            return error
                ? "Impossible d'enregistrer la saison."
                : null;

    }

}

export function SeasonFormDrawer({

    open,

    season,

    loading,

    error,

    onClose,

    onSubmit,

}: Props) {

    const [
        name,
        setName,
    ] = useState("");

    useEffect(() => {

        if (!open) {
            return;
        }

        setName(
            season?.name
            ??
            "",
        );

    }, [
        open,
        season,
    ]);

    const errorMessage =
        getErrorMessage(
            error,
        );

    const canSubmit =
        name.trim() !== ""
        &&
        !loading;

    async function handleSubmit() {

        if (!canSubmit) {
            return;
        }

        await onSubmit({

            name:
                name.trim(),

        });

    }

    return (

        <Drawer
            anchor="right"
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
        >

            <Stack
                spacing={3}
                sx={{
                    width: {
                        xs: "100vw",
                        sm: 460,
                    },

                    maxWidth:
                        "100vw",

                    p: 3,
                }}
            >

                <Stack spacing={0.5}>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        {
                            season
                                ? "Modifier la saison"
                                : "Nouvelle saison"
                        }

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        {
                            season
                                ? "Modifier les informations de la saison"
                                : "Créer une nouvelle saison de championnat"
                        }

                    </Typography>

                </Stack>

                <Divider />

                {
                    errorMessage && (

                        <Alert severity="error">

                            {errorMessage}

                        </Alert>

                    )
                }

                <TextField
                    required
                    autoFocus
                    label="Nom de la saison"
                    value={name}
                    disabled={loading}
                    placeholder="Ex. Championnat de France DartsLive 2027"
                    onChange={
                        event =>
                            setName(
                                event.target.value,
                            )
                    }
                />

                {
                    !season && (

                        <Alert severity="info">

                            La nouvelle saison sera créée inactive.
                            Vous pourrez ensuite la définir comme saison active.

                        </Alert>

                    )
                }

                {
                    season?.active && (

                        <Alert severity="info">

                            Cette saison est actuellement active.
                            La modification de son nom ne change pas son statut.

                        </Alert>

                    )
                }

                <Divider />

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                >

                    <Button
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                        onClick={
                            onClose
                        }
                    >

                        Annuler

                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={
                            !canSubmit
                        }
                        onClick={() => {

                            void handleSubmit();

                        }}
                    >

                        {
                            loading
                                ? "Enregistrement..."
                                : season
                                    ? "Enregistrer"
                                    : "Créer"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default SeasonFormDrawer;