import {
    Alert,
    Button,
    Divider,
    Drawer,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import type {
    Competition,
    CompetitionType,
} from "@/entities/competition";

import type {
    AdminCompetitionRequest,
} from "../model/admin-competition.types";

interface Props {

    open: boolean;

    competition: Competition | null;

    seasonId: string;

    seasonName: string;

    loading: boolean;

    error: string | null;

    onClose(): void;

    onSubmit(
        request: AdminCompetitionRequest,
    ): Promise<void>;

}

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "COMPETITION_SEASON_REQUIRED":
            return "Aucune saison n'est sélectionnée.";

        case "COMPETITION_NAME_REQUIRED":
            return "Le nom de la compétition est obligatoire.";

        case "COMPETITION_MODE_INVALID":
            return "Le mode de compétition est invalide.";

        default:
            return error
                ? "Impossible d'enregistrer la compétition."
                : null;

    }

}

export function CompetitionFormDrawer({

    open,

    competition,

    seasonId,

    seasonName,

    loading,

    error,

    onClose,

    onSubmit,

}: Props) {

    const [
        name,
        setName,
    ] = useState("");

    const [
        mode,
        setMode,
    ] = useState<CompetitionType>(
        "DOUBLES",
    );

    const [
        active,
        setActive,
    ] = useState(true);

    useEffect(() => {

        if (!open) {
            return;
        }

        if (competition) {

            setName(
                competition.name,
            );

            setMode(
                competition.type,
            );

            setActive(
                competition.active,
            );

            return;

        }

        setName("");
        setMode("DOUBLES");
        setActive(true);

    }, [
        open,
        competition,
    ]);

    const errorMessage =
        getErrorMessage(
            error,
        );

    const canSubmit =
        seasonId !== ""
        &&
        name.trim() !== ""
        &&
        !loading;

    async function handleSubmit() {

        if (!canSubmit) {
            return;
        }

        await onSubmit({

            seasonId,

            name:
                name.trim(),

            mode,

            active,

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
                            competition
                                ? "Modifier la compétition"
                                : "Nouvelle compétition"
                        }

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        {seasonName}

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
                    label="Nom"
                    value={name}
                    disabled={loading}
                    placeholder="Ex. Championnat Doublettes"
                    onChange={
                        event =>
                            setName(
                                event.target.value,
                            )
                    }
                />

                <FormControl>

                    <FormLabel>

                        Mode

                    </FormLabel>

                    <RadioGroup
                        value={mode}
                        onChange={
                            event =>
                                setMode(
                                    event.target.value as CompetitionType,
                                )
                        }
                    >

                        <FormControlLabel
                            value="INDIVIDUAL"
                            control={
                                <Radio />
                            }
                            label="Individuel"
                            disabled={loading}
                        />

                        <FormControlLabel
                            value="DOUBLES"
                            control={
                                <Radio />
                            }
                            label="Doublettes"
                            disabled={loading}
                        />

                        <FormControlLabel
                            value="TEAM"
                            control={
                                <Radio />
                            }
                            label="Équipes"
                            disabled={loading}
                        />

                    </RadioGroup>

                </FormControl>

                <FormControlLabel

                    control={

                        <Switch
                            checked={active}
                            disabled={loading}
                            onChange={
                                (_, checked) =>
                                    setActive(
                                        checked,
                                    )
                            }
                        />

                    }

                    label={
                        active
                            ? "Compétition active"
                            : "Compétition inactive"
                    }

                />

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
                                : competition
                                    ? "Enregistrer"
                                    : "Créer"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default CompetitionFormDrawer;