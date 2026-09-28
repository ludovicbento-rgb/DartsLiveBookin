import {
    Alert,
    Button,
    Divider,
    Drawer,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import {
    Timestamp,
} from "firebase/firestore";

import type {
    Competition,
} from "@/entities/competition";

import type {
    MatchDay,
} from "@/entities/matchday";

import type {
    Pool,
} from "@/entities/pool";

import type {
    AdminMatchDayRequest,
} from "../model/admin-matchday.types";

interface Props {

    open: boolean;

    matchDay: MatchDay | null;

    seasonId: string;

    competition: Competition | null;

    pool: Pool | null;

    loading: boolean;

    error: string | null;

    onClose(): void;

    onSubmit(
        request: AdminMatchDayRequest,
    ): Promise<void>;

}

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "MATCHDAY_NUMBER_INVALID":
            return "Le numéro de journée doit être supérieur ou égal à 1.";

        case "MATCHDAY_NAME_REQUIRED":
            return "Le nom de la journée est obligatoire.";

        case "MATCHDAY_COMPETITION_INVALID":
            return "La compétition sélectionnée est invalide.";

        case "MATCHDAY_POOL_INVALID":
            return "La poule sélectionnée est invalide.";

        default:
            return error
                ? "Impossible d'enregistrer la journée."
                : null;

    }

}

function toDateInput(
    timestamp: Timestamp,
): string {

    const date =
        timestamp.toDate();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1,
        ).padStart(
            2,
            "0",
        );

    const day =
        String(
            date.getDate(),
        ).padStart(
            2,
            "0",
        );

    return `${year}-${month}-${day}`;

}

export function MatchDayFormDrawer({

    open,

    matchDay,

    seasonId,

    competition,

    pool,

    loading,

    error,

    onClose,

    onSubmit,

}: Props) {

    const [
        number,
        setNumber,
    ] = useState(1);

    const [
        displayName,
        setDisplayName,
    ] = useState("");

    const [
        officialDate,
        setOfficialDate,
    ] = useState("");

    const [
        active,
        setActive,
    ] = useState(true);

    useEffect(() => {

        if (!open) {
            return;
        }

        if (matchDay) {

            setNumber(
                matchDay.number,
            );

            setDisplayName(
                matchDay.displayName,
            );

            setOfficialDate(
                toDateInput(
                    matchDay.officialDate,
                ),
            );

            setActive(
                matchDay.active,
            );

            return;

        }

        setNumber(1);
        setDisplayName("");
        setOfficialDate("");
        setActive(true);

    }, [
        open,
        matchDay,
    ]);

    if (
        !competition
        ||
        !pool
    ) {

        return null;

    }

    const currentCompetition =
        competition;

    const currentPool =
        pool;

    const canSubmit =
        seasonId !== ""
        &&
        Number.isInteger(
            number,
        )
        &&
        number >= 1
        &&
        displayName.trim() !== ""
        &&
        officialDate !== ""
        &&
        !loading;

    async function handleSubmit() {

        if (!canSubmit) {
            return;
        }

        /*
         * Midi local évite les effets de changement
         * de jour liés aux conversions de fuseau.
         */
        const date =
            new Date(
                `${officialDate}T12:00:00`,
            );

        await onSubmit({

            seasonId,

            competitionId:
                currentCompetition.id,

            poolId:
                currentPool.id,

            number,

            displayName:
                displayName.trim(),

            officialDate:
                Timestamp.fromDate(
                    date,
                ),

            active,

        });

    }

    const errorMessage =
        getErrorMessage(
            error,
        );

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

                    maxWidth: "100vw",

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
                            matchDay
                                ? "Modifier la journée"
                                : "Nouvelle journée"
                        }

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        {currentCompetition.name}

                        {" — "}

                        {currentPool.name}

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
                    label="Numéro de journée"
                    type="number"
                    value={number}
                    disabled={loading}
                    slotProps={{
                        htmlInput: {
                            min: 1,
                            step: 1,
                        },
                    }}
                    onChange={
                        event =>
                            setNumber(
                                Number(
                                    event.target.value,
                                ),
                            )
                    }
                />

                <TextField
                    required
                    label="Nom"
                    value={displayName}
                    disabled={loading}
                    placeholder="Ex. Journée 1"
                    onChange={
                        event =>
                            setDisplayName(
                                event.target.value,
                            )
                    }
                />

                <TextField
                    required
                    label="Date officielle"
                    type="date"
                    value={officialDate}
                    disabled={loading}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    onChange={
                        event =>
                            setOfficialDate(
                                event.target.value,
                            )
                    }
                />

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
                            ? "Journée active"
                            : "Journée inactive"
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
                        onClick={onClose}
                    >

                        Annuler

                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={!canSubmit}
                        onClick={() => {

                            void handleSubmit();

                        }}
                    >

                        {
                            loading
                                ? "Enregistrement..."
                                : matchDay
                                    ? "Enregistrer"
                                    : "Créer"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default MatchDayFormDrawer;