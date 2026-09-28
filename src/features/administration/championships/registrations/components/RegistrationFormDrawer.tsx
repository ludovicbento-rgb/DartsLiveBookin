import {
    Alert,
    Button,
    Checkbox,
    Divider,
    Drawer,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    Competition,
    CompetitionType,
} from "@/entities/competition";

import type {
    Pool,
} from "@/entities/pool";

import type {
    Registration,
} from "@/entities/registration";

import type {
    AdminUserListItem,
} from "@/features/administration/users/model/admin-user.types";

import type {
    Venue,
} from "@/entities/venue";

import type {
    AdminRegistrationRequest,
} from "../model/admin-registration.types";

interface Props {

    open: boolean;

    registration: Registration | null;

    seasonId: string;

    competition: Competition | null;

    pool: Pool | null;

    users: AdminUserListItem[];

    venues: Venue[];

    loading: boolean;

    error: string | null;

    onClose(): void;

    onSubmit(
        request: AdminRegistrationRequest,
    ): Promise<void>;

}



interface ModeRules {

    min: number;

    max: number;

    label: string;

}

function getModeRules(
    type: CompetitionType,
): ModeRules {

    switch (type) {

        case "INDIVIDUAL":
            return {
                min: 1,
                max: 1,
                label: "1 joueur exactement",
            };

        case "DOUBLES":
            return {
                min: 2,
                max: 3,
                label: "2 à 3 joueurs",
            };

        case "TEAM":
            return {
                min: 4,
                max: 6,
                label: "4 à 6 joueurs",
            };

    }

}

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "REGISTRATION_NAME_REQUIRED":
            return "Le nom de l'inscription est obligatoire.";

        case "REGISTRATION_VENUE_REQUIRED":
            return "L'établissement domicile est obligatoire.";

        case "REGISTRATION_CAPTAIN_MUST_PLAY":
            return "Le capitaine doit obligatoirement être joueur.";

        case "REGISTRATION_INDIVIDUAL_PLAYER_COUNT":
            return "Une inscription individuelle doit contenir exactement 1 joueur.";

        case "REGISTRATION_DOUBLES_PLAYER_COUNT":
            return "Une doublette doit contenir 2 ou 3 joueurs.";

        case "REGISTRATION_TEAM_PLAYER_COUNT":
            return "Une équipe doit contenir entre 4 et 6 joueurs.";

        case "REGISTRATION_DUPLICATE_PLAYER":
            return "Un joueur ne peut pas être sélectionné plusieurs fois.";

        default:
            return error
                ? "Impossible d'enregistrer l'inscription."
                : null;

    }

}

export function RegistrationFormDrawer({

    open,

    registration,

    seasonId,

    competition,

    pool,

    users,

    venues,

    loading,

    error,

    onClose,

    onSubmit,

}: Props) {

    const [
        registrationName,
        setRegistrationName,
    ] = useState("");

    const [
        playerIds,
        setPlayerIds,
    ] = useState<string[]>([]);

    const [
        captainId,
        setCaptainId,
    ] = useState("");

    const [
        homeVenueId,
        setHomeVenueId,
    ] = useState("");

    const [
        active,
        setActive,
    ] = useState(true);

    /*
     * ------------------------------------------------------------
     * Joueurs disponibles
     * ------------------------------------------------------------
     */

    const availablePlayers =
        useMemo(
            () =>
                users
                    .filter(
                        user =>
                            user.status === "ACTIVE"
                            &&
                            user.roles.player,
                    )
                    .sort(
                        (a, b) => {

                            const lastname =
                                a.lastname.localeCompare(
                                    b.lastname,
                                    "fr",
                                );

                            if (lastname !== 0) {
                                return lastname;
                            }

                            return a.firstname.localeCompare(
                                b.firstname,
                                "fr",
                            );

                        },
                    ),
            [
                users,
            ],
        );

    /*
     * En modification, on conserve un joueur historique
     * même s'il est désormais BLOCKED ou n'a plus le rôle joueur.
     */
    const selectablePlayers =
        useMemo(
            () => {

                const result =
                    [...availablePlayers];

                if (registration) {

                    for (
                        const playerId
                        of registration.playerIds
                    ) {

                        if (
                            result.some(
                                user =>
                                    user.id ===
                                    playerId,
                            )
                        ) {

                            continue;

                        }

                        const historicalUser =
                            users.find(
                                user =>
                                    user.id ===
                                    playerId,
                            );

                        if (historicalUser) {

                            result.push(
                                historicalUser,
                            );

                        }

                    }

                }

                return result;

            },
            [
                availablePlayers,
                registration,
                users,
            ],
        );

    /*
     * ------------------------------------------------------------
     * Initialisation
     * ------------------------------------------------------------
     */

    useEffect(() => {

        if (!open) {
            return;
        }

        if (registration) {

            setRegistrationName(
                registration.registrationName,
            );

            setPlayerIds(
                registration.playerIds,
            );

            setCaptainId(
                registration.captainId,
            );

            setHomeVenueId(
                registration.homeVenueId,
            );

            setActive(
                registration.active ?? true,
            );

            return;

        }

        setRegistrationName("");
        setPlayerIds([]);
        setCaptainId("");
        setHomeVenueId("");
        setActive(true);

    }, [
        open,
        registration,
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

    console.log(
        "REGISTRATION_COMPETITION_MODE",
        {
            id:
                currentCompetition.id,

            name:
                currentCompetition.name,

            mode:
                currentCompetition.type,
        },
    );


    if (
        !isCompetitionMode(
            currentCompetition.type,
        )
    ) {

        console.error(
            "INVALID_COMPETITION_MODE",
            {
                competitionId:
                    currentCompetition.id,

                mode:
                    currentCompetition.type,
            },
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
                    spacing={2}
                    sx={{
                        width: {
                            xs: "100vw",
                            sm: 500,
                        },
                        maxWidth: "100vw",
                        p: 3,
                    }}
                >

                    <Alert severity="error">

                        Le mode de cette compétition est invalide.
                        Vérifiez sa configuration.

                    </Alert>

                    <Button
                        variant="outlined"
                        onClick={
                            onClose
                        }
                    >

                        Fermer

                    </Button>

                </Stack>

            </Drawer>

        );

    }

    const rules =
        getModeRules(
            currentCompetition.type,
        );

    function isCompetitionMode(
        value: unknown,
    ): value is CompetitionType {

        return (
            value === "INDIVIDUAL"
            ||
            value === "DOUBLES"
            ||
            value === "TEAM"
        );

    }


    /*
     * ------------------------------------------------------------
     * Sélection joueur
     * ------------------------------------------------------------
     */

    function togglePlayer(
        userId: string,
        checked: boolean,
    ) {

        if (checked) {

            if (
                playerIds.length >=
                rules.max
            ) {

                return;

            }

            const next =
                Array.from(
                    new Set([
                        ...playerIds,
                        userId,
                    ]),
                );

            setPlayerIds(
                next,
            );

            /*
             * En individuel le joueur sélectionné
             * devient automatiquement capitaine.
             */
            if (
                currentCompetition.type ===
                "INDIVIDUAL"
            ) {

                setCaptainId(
                    userId,
                );

            }

            return;

        }

        const next =
            playerIds.filter(
                id =>
                    id !== userId,
            );

        setPlayerIds(
            next,
        );

        /*
         * Si on retire le capitaine,
         * il faut en choisir un autre.
         */
        if (
            captainId ===
            userId
        ) {

            if (
                currentCompetition.type ===
                "INDIVIDUAL"
            ) {

                setCaptainId("");

            }
            else {

                setCaptainId(
                    "",
                );

            }

        }

    }

    /*
     * ------------------------------------------------------------
     * Validation UI
     * ------------------------------------------------------------
     */

    const validPlayerCount =
        playerIds.length >= rules.min
        &&
        playerIds.length <= rules.max;

    const captainIsPlayer =
        captainId !== ""
        &&
        playerIds.includes(
            captainId,
        );

    const canSubmit =
        seasonId !== ""
        &&
        registrationName.trim() !== ""
        &&
        homeVenueId !== ""
        &&
        validPlayerCount
        &&
        captainIsPlayer
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

            seasonId,

            competitionId:
                currentCompetition.id,

            poolId:
                currentPool.id,

            registrationName:
                registrationName.trim(),

            captainId,

            playerIds,

            homeVenueId,

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
                        sm: 500,
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
                            registration
                                ? "Modifier l'inscription"
                                : "Nouvelle inscription"
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
                    label="Nom"
                    value={
                        registrationName
                    }
                    disabled={loading}
                    placeholder={
                        currentCompetition.type === "INDIVIDUAL"
                            ? "Ex. Baptiste Tutin"
                            : "Ex. Au Picot Bière"
                    }
                    onChange={
                        event =>
                            setRegistrationName(
                                event.target.value,
                            )
                    }
                />

                <FormControl fullWidth>

                    <InputLabel
                        id="registration-venue-label"
                    >

                        Établissement domicile

                    </InputLabel>

                    <Select
                        labelId="registration-venue-label"
                        label="Établissement domicile"
                        value={
                            homeVenueId
                        }
                        disabled={loading}
                        onChange={
                            event =>
                                setHomeVenueId(
                                    event.target.value,
                                )
                        }
                    >

                        {
                            venues
                                .filter(
                                    venue =>
                                        venue.active
                                        ||
                                        venue.id ===
                                        registration?.homeVenueId,
                                )
                                .sort(
                                    (a, b) =>
                                        a.name.localeCompare(
                                            b.name,
                                            "fr",
                                        ),
                                )
                                .map(
                                    venue => (

                                        <MenuItem
                                            key={
                                                venue.id
                                            }
                                            value={
                                                venue.id
                                            }
                                        >

                                            {venue.name}

                                            {
                                                !venue.active
                                                    ? " — inactif"
                                                    : ""
                                            }

                                        </MenuItem>

                                    ),
                                )
                        }

                    </Select>

                </FormControl>

                <Divider />

                {/*
                 * ------------------------------------------------
                 * Joueurs
                 * ------------------------------------------------
                 */}

                <Stack spacing={1}>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        Joueurs

                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        {rules.label}

                        {" — "}

                        {playerIds.length}
                        /
                        {rules.max}

                    </Typography>

                    {
                        selectablePlayers.map(
                            user => {

                                const checked =
                                    playerIds.includes(
                                        user.id,
                                    );

                                const maxReached =
                                    !checked
                                    &&
                                    playerIds.length >=
                                    rules.max;

                                return (

                                    <FormControlLabel

                                        key={
                                            user.id
                                        }

                                        control={

                                            <Checkbox
                                                checked={
                                                    checked
                                                }
                                                disabled={
                                                    loading
                                                    ||
                                                    maxReached
                                                }
                                                onChange={
                                                    (_, value) =>
                                                        togglePlayer(
                                                            user.id,
                                                            value,
                                                        )
                                                }
                                            />

                                        }

                                        label={
                                            `${user.firstname} ${user.lastname}`
                                        }

                                    />

                                );

                            },
                        )
                    }

                    {
                        !validPlayerCount
                        &&
                        playerIds.length > 0
                        && (

                            <Alert severity="warning">

                                {
                                    currentCompetition.type === "INDIVIDUAL"
                                        ? "Sélectionnez exactement 1 joueur."
                                        : currentCompetition.type === "DOUBLES"
                                            ? "Sélectionnez 2 ou 3 joueurs."
                                            : "Sélectionnez entre 4 et 6 joueurs."
                                }

                            </Alert>

                        )
                    }

                </Stack>

                <Divider />

                {/*
                 * ------------------------------------------------
                 * Capitaine
                 * ------------------------------------------------
                 */}

                <Stack spacing={1}>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        Capitaine

                    </Typography>

                    {
                        currentCompetition.type ===
                            "INDIVIDUAL"
                            ? (

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Le joueur individuel est automatiquement capitaine.

                                </Typography>

                            )
                            : (

                                <FormControl>

                                    <RadioGroup
                                        value={
                                            captainId
                                        }
                                        onChange={
                                            event =>
                                                setCaptainId(
                                                    event.target.value,
                                                )
                                        }
                                    >

                                        {
                                            playerIds.map(
                                                playerId => {

                                                    const user =
                                                        users.find(
                                                            item =>
                                                                item.id ===
                                                                playerId,
                                                        );

                                                    return (

                                                        <FormControlLabel

                                                            key={
                                                                playerId
                                                            }

                                                            value={
                                                                playerId
                                                            }

                                                            control={
                                                                <Radio />
                                                            }

                                                            disabled={
                                                                loading
                                                            }

                                                            label={
                                                                user
                                                                    ? `${user.firstname} ${user.lastname}`
                                                                    : playerId
                                                            }

                                                        />

                                                    );

                                                },
                                            )
                                        }

                                    </RadioGroup>

                                </FormControl>

                            )
                    }

                </Stack>

                <Divider />

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
                            ? "Inscription active"
                            : "Inscription inactive"
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
                                : registration
                                    ? "Enregistrer"
                                    : "Créer"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default RegistrationFormDrawer;      