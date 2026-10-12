import {
    Alert,
    Button,
    Card,
    CardContent,
    Chip,
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

import RefreshIcon
    from "@mui/icons-material/Refresh";

import HistoryIcon
    from "@mui/icons-material/History";

import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    AuditAction,
    AuditEntityType,
    AuditLog,
} from "@/entities/audit-log";

import {
    AdministrationLayout,
} from "@/features/administration/layout/AdministrationLayout";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    useAdminAuditLogs,
} from "../hooks/useAdminAuditLogs";

type ActionFilter =
    | "ALL"
    | AuditAction;

type EntityFilter =
    | "ALL"
    | AuditEntityType;

function getMetadataFieldLabel(
    field: string,
): string {

    switch (field) {

        case "applicationName":
            return "Nom de l'application";

        case "currentSeasonId":
            return "Saison courante";

        case "version":
            return "Version affichée";

        case "playStatus":
            return "Statut de jeu";

        case "status":
            return "Statut";

        case "plannedReservationId":
            return "Réservation planifiée";

        case "homeRegistrationId":
            return "Équipe domicile";

        case "awayRegistrationId":
            return "Équipe extérieure";

        case "firstname":
            return "Prénom";

        case "lastname":
            return "Nom";

        case "email":
            return "E-mail";

        case "rolePlayer":
            return "Rôle Joueur";

        case "roleManager":
            return "Rôle Gérant";

        case "roleAdministrator":
            return "Rôle Administrateur";

        case "userStatus":
            return "Statut du compte";

        default:
            return field;

    }

}

interface AuditChange {

    before: unknown;

    after: unknown;

}

function isAuditChanges(
    value: unknown,
): value is Record<string, AuditChange> {

    if (
        !value
        ||
        typeof value !== "object"
        ||
        Array.isArray(value)
    ) {

        return false;

    }

    return Object
        .values(value)
        .every(
            change =>
                !!change
                &&
                typeof change === "object"
                &&
                !Array.isArray(change)
                &&
                "before" in change
                &&
                "after" in change,
        );

}

function formatAuditValue(
    value: unknown,
): string {

    if (
        value === null
        ||
        value === undefined
        ||
        value === ""
    ) {

        return "—";

    }

    if (
        typeof value === "boolean"
    ) {

        return value
            ? "Oui"
            : "Non";

    }

    if (
        typeof value === "string"
        ||
        typeof value === "number"
    ) {

        return String(value);

    }

    return JSON.stringify(
        value,
    );

}

function getActionLabel(
    action: AuditAction,
): string {

    switch (action) {

        case "MAINTENANCE_ENABLED":
            return "Maintenance activée";

        case "MAINTENANCE_DISABLED":
            return "Maintenance désactivée";

        case "SETTINGS_UPDATED":
            return "Paramètres modifiés";

        case "IMPORT_V1_EXECUTED":
            return "Import saison exécuté";

        case "IMPORT_V2_EXECUTED":
            return "Import incrémental exécuté";

        case "MATCH_CREATED":
            return "Match créé";

        case "MATCH_UPDATED":
            return "Match modifié";

        case "MATCH_PLAY_STATUS_CHANGED":
            return "Statut du match modifié";

        case "USER_CREATED":
            return "Utilisateur créé";

        case "USER_UPDATED":
            return "Utilisateur modifié";

        case "USER_STATUS_CHANGED":
            return "Statut utilisateur modifié";

        default:
            return action;

    }

}

function getEntityLabel(
    entityType: AuditEntityType,
): string {

    switch (entityType) {

        case "SYSTEM":
            return "Système";

        case "IMPORT":
            return "Import";

        case "MATCH":
            return "Match";

        case "USER":
            return "Utilisateur";

        default:
            return entityType;

    }

}

function formatDate(
    log: AuditLog,
): string {

    if (!log.createdAt) {

        return "Date inconnue";

    }

    return log.createdAt
        .toDate()
        .toLocaleString(
            "fr-FR",
            {
                dateStyle:
                    "short",

                timeStyle:
                    "medium",
            },
        );

}

function metadataEntries(
    metadata:
        Record<string, unknown>,
): Array<
    [
        string,
        string,
    ]
> {

    return Object
        .entries(
            metadata,
        )
        .map(
            (
                [
                    key,
                    value,
                ],
            ) => [

                    key,

                    typeof value ===
                        "string"

                        ? value

                        : JSON.stringify(
                            value,
                        ),

                ],
        );

}

export function AuditPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const audit =
        useAdminAuditLogs();

    const [
        actionFilter,
        setActionFilter,
    ] =
        useState<ActionFilter>(
            "ALL",
        );

    const [
        entityFilter,
        setEntityFilter,
    ] =
        useState<EntityFilter>(
            "ALL",
        );

    const [
        search,
        setSearch,
    ] =
        useState("");

    const filteredLogs =
        useMemo(
            () => {

                const normalizedSearch =
                    search
                        .trim()
                        .toLocaleLowerCase(
                            "fr",
                        );

                return audit.logs.filter(
                    log => {

                        if (
                            actionFilter !==
                            "ALL"
                            &&
                            log.action !==
                            actionFilter
                        ) {

                            return false;

                        }

                        if (
                            entityFilter !==
                            "ALL"
                            &&
                            log.entityType !==
                            entityFilter
                        ) {

                            return false;

                        }

                        if (
                            normalizedSearch ===
                            ""
                        ) {

                            return true;

                        }

                        const searchable =
                            [
                                log.userDisplayName,
                                log.userId,
                                log.entityId ?? "",
                                getActionLabel(
                                    log.action,
                                ),
                                getEntityLabel(
                                    log.entityType,
                                ),
                            ]
                                .join(" ")
                                .toLocaleLowerCase(
                                    "fr",
                                );

                        return searchable.includes(
                            normalizedSearch,
                        );

                    },
                );

            },
            [
                audit.logs,
                actionFilter,
                entityFilter,
                search,
            ],
        );

    if (
        !profile
        ||
        !profile.roles.administrator
    ) {

        return (

            <AdministrationLayout>

                <Alert severity="error">

                    Vous n'êtes pas autorisé à consulter le journal d'audit.

                </Alert>

            </AdministrationLayout>

        );

    }

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
                    direction={{
                        xs: "column",
                        sm: "row",
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

                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems:
                                "center",
                        }}
                    >

                        <HistoryIcon
                            color="primary"
                        />

                        <Stack>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight:
                                        700,
                                }}
                            >

                                Journal d'audit

                            </Typography>

                            <Typography
                                color="text.secondary"
                            >

                                Historique des actions administratives

                            </Typography>

                        </Stack>

                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={
                            <RefreshIcon />
                        }
                        disabled={
                            audit.loading
                        }
                        onClick={() => {

                            void audit.reload();

                        }}
                    >

                        Actualiser

                    </Button>

                </Stack>

                <Card
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                    }}
                >

                    <CardContent>

                        <Stack
                            direction={{
                                xs:
                                    "column",

                                md:
                                    "row",
                            }}
                            spacing={2}
                        >

                            <FormControl
                                fullWidth
                            >

                                <InputLabel
                                    id="audit-action-filter-label"
                                >

                                    Action

                                </InputLabel>

                                <Select
                                    labelId="audit-action-filter-label"
                                    label="Action"
                                    value={
                                        actionFilter
                                    }
                                    onChange={
                                        event =>
                                            setActionFilter(
                                                event
                                                    .target
                                                    .value as
                                                ActionFilter,
                                            )
                                    }
                                >

                                    <MenuItem value="ALL">

                                        Toutes

                                    </MenuItem>

                                    <MenuItem value="MAINTENANCE_ENABLED">

                                        Maintenance activée

                                    </MenuItem>

                                    <MenuItem value="MAINTENANCE_DISABLED">

                                        Maintenance désactivée

                                    </MenuItem>

                                    <MenuItem value="SETTINGS_UPDATED">

                                        Paramètres modifiés

                                    </MenuItem>

                                    <MenuItem value="IMPORT_V1_EXECUTED">

                                        Import saison

                                    </MenuItem>

                                    <MenuItem value="IMPORT_V2_EXECUTED">

                                        Import incrémental

                                    </MenuItem>

                                    <MenuItem value="MATCH_CREATED">

                                        Match créé

                                    </MenuItem>

                                    <MenuItem value="MATCH_UPDATED">

                                        Match modifié

                                    </MenuItem>

                                    <MenuItem value="MATCH_PLAY_STATUS_CHANGED">

                                        Statut match modifié

                                    </MenuItem>

                                    <MenuItem value="USER">
                                        Utilisateur
                                    </MenuItem>

                                </Select>

                            </FormControl>

                            <FormControl
                                fullWidth
                            >

                                <InputLabel
                                    id="audit-entity-filter-label"
                                >

                                    Type

                                </InputLabel>

                                <Select
                                    labelId="audit-entity-filter-label"
                                    label="Type"
                                    value={
                                        entityFilter
                                    }
                                    onChange={
                                        event =>
                                            setEntityFilter(
                                                event
                                                    .target
                                                    .value as
                                                EntityFilter,
                                            )
                                    }
                                >

                                    <MenuItem value="ALL">

                                        Tous

                                    </MenuItem>

                                    <MenuItem value="SYSTEM">

                                        Système

                                    </MenuItem>

                                    <MenuItem value="IMPORT">

                                        Import

                                    </MenuItem>

                                    <MenuItem value="MATCH">

                                        Match

                                    </MenuItem>

                                </Select>

                            </FormControl>

                            <TextField
                                fullWidth
                                label="Rechercher"
                                placeholder="Utilisateur, ID, action..."
                                value={
                                    search
                                }
                                onChange={
                                    event =>
                                        setSearch(
                                            event
                                                .target
                                                .value,
                                        )
                                }
                            />

                        </Stack>

                    </CardContent>

                </Card>

                {
                    audit.loading && (

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

                                Chargement du journal...

                            </Typography>

                        </Stack>

                    )
                }

                {
                    audit.error && (

                        <Alert severity="error">

                            Impossible de charger le journal d'audit.

                        </Alert>

                    )
                }

                {
                    !audit.loading
                    &&
                    !audit.error
                    && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >

                            {
                                filteredLogs.length
                            }

                            {" "}

                            événement(s)

                        </Typography>

                    )
                }

                {
                    !audit.loading
                    &&
                    !audit.error
                    &&
                    filteredLogs.length ===
                    0
                    && (

                        <Alert severity="info">

                            Aucun événement ne correspond aux filtres.

                        </Alert>

                    )
                }

                {
                    !audit.loading
                    &&
                    !audit.error
                    &&
                    filteredLogs.map(
                        log => (

                            <Card
                                key={
                                    log.id
                                }
                                variant="outlined"
                                sx={{
                                    borderRadius:
                                        3,
                                }}
                            >

                                <CardContent>

                                    <Stack spacing={2}>

                                        <Stack
                                            direction={{
                                                xs:
                                                    "column",

                                                sm:
                                                    "row",
                                            }}
                                            spacing={1}
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
                                                    sx={{
                                                        fontWeight:
                                                            700,
                                                    }}
                                                >

                                                    {
                                                        getActionLabel(
                                                            log.action,
                                                        )
                                                    }

                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >

                                                    {
                                                        formatDate(
                                                            log,
                                                        )
                                                    }

                                                </Typography>

                                            </Stack>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                            >

                                                <Chip
                                                    size="small"
                                                    label={
                                                        getEntityLabel(
                                                            log.entityType,
                                                        )
                                                    }
                                                />

                                                <Chip
                                                    size="small"
                                                    variant="outlined"
                                                    label={
                                                        log.action
                                                    }
                                                />

                                            </Stack>

                                        </Stack>

                                        <Divider />

                                        <Stack spacing={0.5}>

                                            <Typography
                                                variant="body2"
                                            >

                                                <strong>
                                                    Utilisateur :
                                                </strong>

                                                {" "}

                                                {
                                                    log.userDisplayName
                                                }

                                            </Typography>

                                            <Typography
                                                variant="body2"
                                            >

                                                <strong>
                                                    Entité :
                                                </strong>

                                                {" "}

                                                {
                                                    log.entityId
                                                    ??
                                                    "—"
                                                }

                                            </Typography>

                                        </Stack>

                                        {
                                            Object.keys(
                                                log.metadata,
                                            ).length > 0
                                            && (

                                                <Stack spacing={1.5}>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 700,
                                                        }}
                                                    >

                                                        Détails

                                                    </Typography>

                                                    {
                                                        isAuditChanges(
                                                            log.metadata.changes,
                                                        )

                                                            ? Object
                                                                .entries(
                                                                    log.metadata.changes,
                                                                )
                                                                .map(
                                                                    (
                                                                        [
                                                                            field,
                                                                            change,
                                                                        ],
                                                                    ) => (

                                                                        <Stack
                                                                            key={
                                                                                field
                                                                            }
                                                                            spacing={0.25}
                                                                        >

                                                                            <Typography
                                                                                variant="body2"
                                                                                sx={{
                                                                                    fontWeight:
                                                                                        600,
                                                                                }}
                                                                            >

                                                                                {
                                                                                    getMetadataFieldLabel(
                                                                                        field,
                                                                                    )
                                                                                }

                                                                            </Typography>

                                                                            <Typography
                                                                                variant="body2"
                                                                                color="text.secondary"
                                                                            >

                                                                                {
                                                                                    formatAuditValue(
                                                                                        change.before,
                                                                                    )
                                                                                }

                                                                                {" → "}

                                                                                {
                                                                                    formatAuditValue(
                                                                                        change.after,
                                                                                    )
                                                                                }

                                                                            </Typography>

                                                                        </Stack>

                                                                    ),
                                                                )

                                                            : metadataEntries(
                                                                log.metadata,
                                                            ).map(
                                                                (
                                                                    [
                                                                        key,
                                                                        value,
                                                                    ],
                                                                ) => (

                                                                    <Typography
                                                                        key={
                                                                            key
                                                                        }
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >

                                                                        {key}

                                                                        :

                                                                        {" "}

                                                                        {value}

                                                                    </Typography>

                                                                ),
                                                            )
                                                    }

                                                </Stack>

                                            )
                                        }

                                    </Stack>

                                </CardContent>

                            </Card>

                        ),
                    )
                }

            </Stack>

        </AdministrationLayout>

    );

}

export default AuditPage;   