import {
    Alert,
    Button,
    Divider,
    Drawer,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    Match,
} from "@/entities/match";

import type {
    MatchDay,
} from "@/entities/matchday";

import type {
    Registration,
} from "@/entities/registration";

import type {
    AdminMatchRequest,
} from "../model/admin-match.types";

interface Props {

    open: boolean;

    match: Match | null;

    matchDay: MatchDay | null;

    registrations: Registration[];

    matches: Match[];

    loading: boolean;

    error: string | null;

    onClose(): void;

    onSubmit(
        request: AdminMatchRequest,
    ): Promise<void>;

}

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "MATCH_REQUIRED_DATA":
            return "Les deux inscriptions doivent être sélectionnées.";

        case "MATCH_SAME_REGISTRATION":
            return "Une inscription ne peut pas jouer contre elle-même.";

        case "MATCH_REGISTRATION_NOT_FOUND":
            return "Une des inscriptions sélectionnées est introuvable.";

        case "MATCH_REGISTRATION_INACTIVE":
            return "Une des inscriptions sélectionnées est inactive.";

        case "MATCH_COMPETITION_MISMATCH":
            return "Une inscription n'appartient pas à la compétition de cette journée.";

        case "MATCH_POOL_MISMATCH":
            return "Une inscription n'appartient pas à la poule de cette journée.";

        case "MATCH_REGISTRATION_ALREADY_PLAYING":
            return "Une des inscriptions joue déjà un match pendant cette journée.";

        case "MATCH_ALREADY_RESERVED":
            return "Ce match possède déjà une réservation et ne peut plus être modifié.";

        case "MATCHDAY_IMMUTABLE":
            return "La journée d'un match existant ne peut pas être modifiée.";

        default:
            return error
                ? "Impossible d'enregistrer le match."
                : null;

    }

}

export function MatchFormDrawer({

    open,

    match,

    matchDay,

    registrations,

    matches,

    loading,

    error,

    onClose,

    onSubmit,

}: Props) {

    const [
        homeRegistrationId,
        setHomeRegistrationId,
    ] = useState("");

    const [
        awayRegistrationId,
        setAwayRegistrationId,
    ] = useState("");

    useEffect(() => {

        if (!open) {
            return;
        }

        if (match) {

            setHomeRegistrationId(
                match.homeRegistrationId,
            );

            setAwayRegistrationId(
                match.awayRegistrationId,
            );

            return;

        }

        setHomeRegistrationId("");
        setAwayRegistrationId("");

    }, [
        open,
        match,
    ]);

    /*
     * ------------------------------------------------------------
     * Inscriptions déjà utilisées dans cette journée
     * ------------------------------------------------------------
     *
     * En modification, le match courant est exclu :
     * ses deux inscriptions restent donc disponibles.
     */

    const usedRegistrationIds =
        useMemo(
            () => {

                const result =
                    new Set<string>();

                for (
                    const existingMatch
                    of matches
                ) {

                    if (
                        match
                        &&
                        existingMatch.id ===
                        match.id
                    ) {

                        continue;

                    }

                    result.add(
                        existingMatch.homeRegistrationId,
                    );

                    result.add(
                        existingMatch.awayRegistrationId,
                    );

                }

                return result;

            },
            [
                matches,
                match,
            ],
        );

    /*
     * ------------------------------------------------------------
     * Inscriptions disponibles
     * ------------------------------------------------------------
     */

    const availableRegistrations =
        useMemo(
            () =>
                registrations
                    .filter(
                        registration =>
                            registration.active ===
                            true,
                    )
                    .sort(
                        (a, b) =>
                            a.registrationName.localeCompare(
                                b.registrationName,
                                "fr",
                            ),
                    ),
            [
                registrations,
            ],
        );

    if (!matchDay) {

        return null;

    }

    const currentMatchDay =
        matchDay;

    const canSubmit =
        homeRegistrationId !== ""
        &&
        awayRegistrationId !== ""
        &&
        homeRegistrationId !==
        awayRegistrationId
        &&
        !usedRegistrationIds.has(
            homeRegistrationId,
        )
        &&
        !usedRegistrationIds.has(
            awayRegistrationId,
        )
        &&
        !loading;

    const errorMessage =
        getErrorMessage(
            error,
        );

    async function handleSubmit() {

        if (!canSubmit) {
            return;
        }

        await onSubmit({

            matchDayId:
                currentMatchDay.id,

            homeRegistrationId,

            awayRegistrationId,

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
                        sm: 480,
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
                            match
                                ? "Modifier le match"
                                : "Nouveau match"
                        }

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        {currentMatchDay.displayName}

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

                {
                    availableRegistrations.length < 2
                    && (

                        <Alert severity="warning">

                            Au moins deux inscriptions actives sont nécessaires
                            pour créer une rencontre.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * DOMICILE
                 * ------------------------------------------------
                 */}

                <FormControl
                    fullWidth
                    required
                >

                    <InputLabel
                        id="match-home-registration-label"
                    >

                        Domicile

                    </InputLabel>

                    <Select
                        labelId="match-home-registration-label"
                        label="Domicile"
                        value={
                            homeRegistrationId
                        }
                        disabled={loading}
                        onChange={
                            event =>
                                setHomeRegistrationId(
                                    event.target.value,
                                )
                        }
                    >

                        {
                            availableRegistrations.map(
                                registration => {

                                    const used =
                                        usedRegistrationIds.has(
                                            registration.id,
                                        );

                                    const sameAsAway =
                                        registration.id ===
                                        awayRegistrationId;

                                    return (

                                        <MenuItem
                                            key={
                                                registration.id
                                            }
                                            value={
                                                registration.id
                                            }
                                            disabled={
                                                used
                                                ||
                                                sameAsAway
                                            }
                                        >

                                            {
                                                registration
                                                    .registrationName
                                            }

                                            {
                                                used
                                                    ? " — déjà utilisée"
                                                    : ""
                                            }

                                        </MenuItem>

                                    );

                                },
                            )
                        }

                    </Select>

                </FormControl>

                {/*
                 * ------------------------------------------------
                 * EXTERIEUR
                 * ------------------------------------------------
                 */}

                <FormControl
                    fullWidth
                    required
                >

                    <InputLabel
                        id="match-away-registration-label"
                    >

                        Extérieur

                    </InputLabel>

                    <Select
                        labelId="match-away-registration-label"
                        label="Extérieur"
                        value={
                            awayRegistrationId
                        }
                        disabled={loading}
                        onChange={
                            event =>
                                setAwayRegistrationId(
                                    event.target.value,
                                )
                        }
                    >

                        {
                            availableRegistrations.map(
                                registration => {

                                    const used =
                                        usedRegistrationIds.has(
                                            registration.id,
                                        );

                                    const sameAsHome =
                                        registration.id ===
                                        homeRegistrationId;

                                    return (

                                        <MenuItem
                                            key={
                                                registration.id
                                            }
                                            value={
                                                registration.id
                                            }
                                            disabled={
                                                used
                                                ||
                                                sameAsHome
                                            }
                                        >

                                            {
                                                registration
                                                    .registrationName
                                            }

                                            {
                                                used
                                                    ? " — déjà utilisée"
                                                    : ""
                                            }

                                        </MenuItem>

                                    );

                                },
                            )
                        }

                    </Select>

                </FormControl>

                {
                    homeRegistrationId !== ""
                    &&
                    awayRegistrationId !== ""
                    && (

                        <Alert severity="info">

                            Le premier participant est l'inscription à domicile.
                            Le second est l'inscription extérieure.

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
                                : match
                                    ? "Enregistrer"
                                    : "Créer"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default MatchFormDrawer; 