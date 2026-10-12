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
    Typography,
} from "@mui/material";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import DownloadIcon
    from "@mui/icons-material/Download";

import Inventory2Icon
    from "@mui/icons-material/Inventory2";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    Season,
} from "@/entities/season";

import {
    getSeasons,
} from "@/entities/season";

import type {
    Competition,
} from "@/entities/competition";

import {
    getCompetitionsBySeason,
} from "@/entities/competition";

import type {
    Pool,
} from "@/entities/pool";

import {
    getPoolsByCompetition,
} from "@/entities/pool";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    AdministrationLayout,
} from "@/features/administration/layout/AdministrationLayout";

import {
    useSeasonExport,
} from "../hooks/useSeasonExport";

import {
    usePoolExport,
} from "../hooks/usePoolExport";

type ExportScope =
    | "SEASON"
    | "POOL";

export function ExportSeasonPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const seasonExport =
        useSeasonExport();

    const poolExport =
        usePoolExport();

    /*
     * ============================================================
     * PERIMETRE
     * ============================================================
     */

    const [
        scope,
        setScope,
    ] =
        useState<ExportScope>(
            "SEASON",
        );

    /*
     * ============================================================
     * SAISONS
     * ============================================================
     */

    const [
        seasons,
        setSeasons,
    ] =
        useState<Season[]>(
            [],
        );

    const [
        selectedSeasonId,
        setSelectedSeasonId,
    ] =
        useState("");

    const [
        seasonsLoading,
        setSeasonsLoading,
    ] =
        useState(true);

    const [
        seasonsError,
        setSeasonsError,
    ] =
        useState(false);

    /*
     * ============================================================
     * COMPETITIONS
     * ============================================================
     */

    const [
        competitions,
        setCompetitions,
    ] =
        useState<Competition[]>(
            [],
        );

    const [
        selectedCompetitionId,
        setSelectedCompetitionId,
    ] =
        useState("");

    const [
        competitionsLoading,
        setCompetitionsLoading,
    ] =
        useState(false);

    /*
     * ============================================================
     * POULES
     * ============================================================
     */

    const [
        pools,
        setPools,
    ] =
        useState<Pool[]>(
            [],
        );

    const [
        selectedPoolId,
        setSelectedPoolId,
    ] =
        useState("");

    const [
        poolsLoading,
        setPoolsLoading,
    ] =
        useState(false);

    const [
        contextError,
        setContextError,
    ] =
        useState(false);

    /*
     * ============================================================
     * CHARGEMENT DES SAISONS
     * ============================================================
     */

    useEffect(() => {

        let cancelled =
            false;

        async function load() {

            try {

                setSeasonsLoading(
                    true,
                );

                setSeasonsError(
                    false,
                );

                const result =
                    await getSeasons();

                if (cancelled) {
                    return;
                }

                const sorted =
                    [...result].sort(
                        (a, b) =>
                            b.name.localeCompare(
                                a.name,
                                "fr",
                            ),
                    );

                setSeasons(
                    sorted,
                );

                const defaultSeason =
                    sorted.find(
                        season =>
                            season.active,
                    )
                    ??
                    sorted[0];

                setSelectedSeasonId(
                    defaultSeason?.id
                    ??
                    "",
                );

            }
            catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "EXPORT_SEASONS_LOAD_FAILED",
                    error,
                );

                setSeasonsError(
                    true,
                );

            }
            finally {

                if (!cancelled) {

                    setSeasonsLoading(
                        false,
                    );

                }

            }

        }

        void load();

        return () => {

            cancelled =
                true;

        };

    }, []);

    const selectedSeason =
        useMemo(
            () =>
                seasons.find(
                    season =>
                        season.id ===
                        selectedSeasonId,
                )
                ??
                null,
            [
                seasons,
                selectedSeasonId,
            ],
        );

    /*
     * ============================================================
     * EXPORT SAISON COMPLETE
     * ============================================================
     */

    useEffect(() => {

        if (
            scope !== "SEASON"
            ||
            !selectedSeason
        ) {

            seasonExport.reset();

            return;

        }

        seasonExport.reset();

        void seasonExport.prepare(
            selectedSeason,
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        scope,
        selectedSeasonId,
    ]);

    /*
     * ============================================================
     * COMPETITIONS DE LA SAISON
     * ============================================================
     */

    useEffect(() => {

        let cancelled =
            false;

        async function load() {

            poolExport.reset();

            setCompetitions([]);
            setSelectedCompetitionId("");

            setPools([]);
            setSelectedPoolId("");

            if (
                scope !== "POOL"
                ||
                !selectedSeasonId
            ) {

                return;

            }

            try {

                setCompetitionsLoading(
                    true,
                );

                setContextError(
                    false,
                );

                const result =
                    await getCompetitionsBySeason(
                        selectedSeasonId,
                    );

                if (cancelled) {
                    return;
                }

                const sorted =
                    [...result].sort(
                        (a, b) =>
                            a.name.localeCompare(
                                b.name,
                                "fr",
                            ),
                    );

                setCompetitions(
                    sorted,
                );

                const defaultCompetition =
                    sorted.find(
                        competition =>
                            competition.active,
                    )
                    ??
                    sorted[0];

                setSelectedCompetitionId(
                    defaultCompetition?.id
                    ??
                    "",
                );

            }
            catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "POOL_EXPORT_COMPETITIONS_LOAD_FAILED",
                    error,
                );

                setContextError(
                    true,
                );

            }
            finally {

                if (!cancelled) {

                    setCompetitionsLoading(
                        false,
                    );

                }

            }

        }

        void load();

        return () => {

            cancelled =
                true;

        };

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        scope,
        selectedSeasonId,
    ]);

    const selectedCompetition =
        useMemo(
            () =>
                competitions.find(
                    competition =>
                        competition.id ===
                        selectedCompetitionId,
                )
                ??
                null,
            [
                competitions,
                selectedCompetitionId,
            ],
        );

    /*
     * ============================================================
     * POULES DE LA COMPETITION
     * ============================================================
     */

    useEffect(() => {

        let cancelled =
            false;

        async function load() {

            poolExport.reset();

            setPools([]);
            setSelectedPoolId("");

            if (
                scope !== "POOL"
                ||
                !selectedCompetitionId
            ) {

                return;

            }

            try {

                setPoolsLoading(
                    true,
                );

                setContextError(
                    false,
                );

                const result =
                    await getPoolsByCompetition(
                        selectedCompetitionId,
                    );

                if (cancelled) {
                    return;
                }

                const sorted =
                    [...result].sort(
                        (a, b) => {

                            const orderDifference =
                                a.order -
                                b.order;

                            if (
                                orderDifference !== 0
                            ) {

                                return orderDifference;

                            }

                            return a.name.localeCompare(
                                b.name,
                                "fr",
                            );

                        },
                    );

                setPools(
                    sorted,
                );

                const defaultPool =
                    sorted.find(
                        pool =>
                            pool.active,
                    )
                    ??
                    sorted[0];

                setSelectedPoolId(
                    defaultPool?.id
                    ??
                    "",
                );

            }
            catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "POOL_EXPORT_POOLS_LOAD_FAILED",
                    error,
                );

                setContextError(
                    true,
                );

            }
            finally {

                if (!cancelled) {

                    setPoolsLoading(
                        false,
                    );

                }

            }

        }

        void load();

        return () => {

            cancelled =
                true;

        };

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        scope,
        selectedCompetitionId,
    ]);

    const selectedPool =
        useMemo(
            () =>
                pools.find(
                    pool =>
                        pool.id ===
                        selectedPoolId,
                )
                ??
                null,
            [
                pools,
                selectedPoolId,
            ],
        );

    /*
     * ============================================================
     * PREPARATION EXPORT POULE
     * ============================================================
     */

    useEffect(() => {

        if (
            scope !== "POOL"
            ||
            !selectedSeason
            ||
            !selectedCompetition
            ||
            !selectedPool
        ) {

            poolExport.reset();

            return;

        }

        poolExport.reset();

        void poolExport.prepare(

            selectedSeason.id,

            selectedCompetition,

            selectedPool,

        );

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        scope,
        selectedSeasonId,
        selectedCompetitionId,
        selectedPoolId,
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

                    Vous n'êtes pas autorisé à exporter les données.

                </Alert>

            </AdministrationLayout>

        );

    }

    /*
     * ============================================================
     * DOWNLOAD
     * ============================================================
     */

    function handleSeasonDownload() {

        if (
            !selectedSeason
            ||
            !seasonExport.data
        ) {

            return;

        }

        seasonExport.download(
            selectedSeason,
            seasonExport.data,
        );

    }

    function handlePoolDownload() {

        if (
            !selectedPool
            ||
            !poolExport.prepared
        ) {

            return;

        }

        poolExport.download(
            selectedPool,
        );

    }

    const loading =
        seasonsLoading
        ||
        competitionsLoading
        ||
        poolsLoading
        ||
        seasonExport.loading
        ||
        poolExport.loading;

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

                    <Inventory2Icon
                        color="primary"
                    />

                    <Stack>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Exporter des données

                        </Typography>

                        <Typography
                            color="text.secondary"
                        >

                            Export complet d'une saison ou export ciblé d'une poule

                        </Typography>

                    </Stack>

                </Stack>

                {
                    seasonsError && (

                        <Alert severity="error">

                            Impossible de charger les saisons.

                        </Alert>

                    )
                }

                {
                    contextError && (

                        <Alert severity="error">

                            Impossible de charger le contexte de championnat.

                        </Alert>

                    )
                }

                {/*
                 * =================================================
                 * PERIMETRE
                 * =================================================
                 */}

                <FormControl fullWidth>

                    <InputLabel
                        id="export-scope-label"
                    >

                        Périmètre

                    </InputLabel>

                    <Select
                        labelId="export-scope-label"
                        label="Périmètre"
                        value={
                            scope
                        }
                        disabled={
                            loading
                        }
                        onChange={
                            event =>
                                setScope(
                                    event.target.value as
                                    ExportScope,
                                )
                        }
                    >

                        <MenuItem value="SEASON">

                            Saison complète

                        </MenuItem>

                        <MenuItem value="POOL">

                            Une poule

                        </MenuItem>

                    </Select>

                </FormControl>

                {/*
                 * =================================================
                 * SAISON
                 * =================================================
                 */}

                <FormControl
                    fullWidth
                    disabled={
                        loading
                        ||
                        seasons.length === 0
                    }
                >

                    <InputLabel
                        id="export-season-label"
                    >

                        Saison

                    </InputLabel>

                    <Select
                        labelId="export-season-label"
                        label="Saison"
                        value={
                            selectedSeasonId
                        }
                        onChange={
                            event =>
                                setSelectedSeasonId(
                                    event.target.value,
                                )
                        }
                    >

                        {
                            seasons.map(
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

                {/*
                 * =================================================
                 * COMPETITION / POULE
                 * =================================================
                 */}

                {
                    scope === "POOL" && (

                        <>

                            <FormControl
                                fullWidth
                                disabled={
                                    loading
                                    ||
                                    competitions.length === 0
                                }
                            >

                                <InputLabel
                                    id="export-competition-label"
                                >

                                    Compétition

                                </InputLabel>

                                <Select
                                    labelId="export-competition-label"
                                    label="Compétition"
                                    value={
                                        selectedCompetitionId
                                    }
                                    onChange={
                                        event =>
                                            setSelectedCompetitionId(
                                                event.target.value,
                                            )
                                    }
                                >

                                    {
                                        competitions.map(
                                            competition => (

                                                <MenuItem
                                                    key={
                                                        competition.id
                                                    }
                                                    value={
                                                        competition.id
                                                    }
                                                >

                                                    {
                                                        competition.name
                                                    }

                                                </MenuItem>

                                            ),
                                        )
                                    }

                                </Select>

                            </FormControl>

                            <FormControl
                                fullWidth
                                disabled={
                                    loading
                                    ||
                                    pools.length === 0
                                }
                            >

                                <InputLabel
                                    id="export-pool-label"
                                >

                                    Poule

                                </InputLabel>

                                <Select
                                    labelId="export-pool-label"
                                    label="Poule"
                                    value={
                                        selectedPoolId
                                    }
                                    onChange={
                                        event =>
                                            setSelectedPoolId(
                                                event.target.value,
                                            )
                                    }
                                >

                                    {
                                        pools.map(
                                            pool => (

                                                <MenuItem
                                                    key={
                                                        pool.id
                                                    }
                                                    value={
                                                        pool.id
                                                    }
                                                >

                                                    {
                                                        pool.name
                                                    }

                                                </MenuItem>

                                            ),
                                        )
                                    }

                                </Select>

                            </FormControl>

                        </>

                    )
                }

                {
                    loading && (

                        <Stack
                            spacing={2}
                            sx={{
                                alignItems:
                                    "center",

                                py: 4,
                            }}
                        >

                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                            >

                                Préparation de l'export...

                            </Typography>

                        </Stack>

                    )
                }

                {
                    seasonExport.error && (

                        <Alert severity="error">

                            Impossible de préparer l'export de la saison.

                        </Alert>

                    )
                }

                {
                    poolExport.error && (

                        <Alert severity="error">

                            Impossible de préparer l'export de la poule.

                        </Alert>

                    )
                }

                {/*
                 * =================================================
                 * APERCU SAISON
                 * =================================================
                 */}

                {
                    scope === "SEASON"
                    &&
                    seasonExport.data
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

                                <Stack spacing={2}>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    >

                                        Contenu de la saison

                                    </Typography>

                                    <Divider />

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={3}
                                        sx={{
                                            flexWrap:
                                                "wrap",
                                        }}
                                    >

                                        <ExportCounter
                                            label="Compétitions"
                                            value={
                                                seasonExport
                                                    .data
                                                    .competitions
                                                    .length
                                            }
                                        />

                                        <ExportCounter
                                            label="Poules"
                                            value={
                                                seasonExport
                                                    .data
                                                    .pools
                                                    .length
                                            }
                                        />

                                        <ExportCounter
                                            label="Inscriptions"
                                            value={
                                                seasonExport
                                                    .data
                                                    .registrations
                                                    .length
                                            }
                                        />

                                        <ExportCounter
                                            label="Journées"
                                            value={
                                                seasonExport
                                                    .data
                                                    .matchDays
                                                    .length
                                            }
                                        />

                                        <ExportCounter
                                            label="Matchs"
                                            value={
                                                seasonExport
                                                    .data
                                                    .matches
                                                    .length
                                            }
                                        />

                                    </Stack>

                                    <Alert severity="info">

                                        L'export complet utilise
                                        schemaVersion 1.

                                    </Alert>

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <DownloadIcon />
                                        }
                                        onClick={
                                            handleSeasonDownload
                                        }
                                    >

                                        Exporter la saison en JSON

                                    </Button>

                                </Stack>

                            </CardContent>

                        </Card>

                    )
                }

                {/*
                 * =================================================
                 * APERCU POULE
                 * =================================================
                 */}

                {
                    scope === "POOL"
                    &&
                    selectedPool
                    &&
                    poolExport.prepared
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

                                <Stack spacing={2}>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    >

                                        {
                                            selectedPool.name
                                        }

                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >

                                        Export incrémental schemaVersion 2

                                    </Typography>

                                    <Divider />

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={3}
                                        sx={{
                                            flexWrap:
                                                "wrap",
                                        }}
                                    >

                                        <ExportCounter
                                            label="Inscriptions"
                                            value={
                                                poolExport
                                                    .prepared
                                                    .statistics
                                                    .registrations
                                            }
                                        />

                                        <ExportCounter
                                            label="Journées"
                                            value={
                                                poolExport
                                                    .prepared
                                                    .statistics
                                                    .matchDays
                                            }
                                        />

                                        <ExportCounter
                                            label="Matchs"
                                            value={
                                                poolExport
                                                    .prepared
                                                    .statistics
                                                    .matches
                                            }
                                        />

                                        <ExportCounter
                                            label="Joués"
                                            value={
                                                poolExport
                                                    .prepared
                                                    .statistics
                                                    .playedMatches
                                            }
                                        />

                                        <ExportCounter
                                            label="À jouer"
                                            value={
                                                poolExport
                                                    .prepared
                                                    .statistics
                                                    .toPlayMatches
                                            }
                                        />

                                    </Stack>

                                    <Alert severity="success">

                                        Ce fichier est directement compatible
                                        avec l'import incrémental V2.

                                    </Alert>

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <DownloadIcon />
                                        }
                                        onClick={
                                            handlePoolDownload
                                        }
                                    >

                                        Exporter la poule en JSON

                                    </Button>

                                </Stack>

                            </CardContent>

                        </Card>

                    )
                }

            </Stack>

        </AdministrationLayout>

    );

}

interface ExportCounterProps {

    label: string;

    value: number;

}

function ExportCounter({

    label,

    value,

}: ExportCounterProps) {

    return (

        <Stack
            spacing={0.5}
            sx={{
                minWidth: 110,
            }}
        >

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                }}
            >

                {value}

            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
            >

                {label}

            </Typography>

        </Stack>

    );

}

export default ExportSeasonPage;    