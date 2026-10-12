import {
    Alert,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import FileUploadIcon
    from "@mui/icons-material/FileUpload";

import PublishIcon
    from "@mui/icons-material/Publish";

import CheckCircleIcon
    from "@mui/icons-material/CheckCircle";

import {
    useRef,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    ImportV2AnalysisSummary,
} from "../components/ImportV2AnalysisSummary";

import {
    useSeasonImportV2Analysis,
} from "../hooks/useSeasonImportV2Analysis";

import {
    useExecuteSeasonImportV2,
} from "../hooks/useExecuteSeasonImportV2";

interface ImportSeasonV2PageProps {

    initialFile: File;

}

export function ImportSeasonV2Page({

    initialFile,

}: ImportSeasonV2PageProps) {


    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const analysis =
        useSeasonImportV2Analysis();

    const execution =
        useExecuteSeasonImportV2();

    const fileInputRef =
        useRef<HTMLInputElement | null>(
            null,
        );

    const [
        confirmationOpen,
        setConfirmationOpen,
    ] =
        useState(false);

    useEffect(() => {

        execution.reset();

        setConfirmationOpen(
            false,
        );

        void analysis.analyzeFile(
            initialFile,
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        initialFile,
    ]);

    /*
     * ============================================================
     * SECURITE UI
     * ============================================================
     */

    if (
        !profile
        ||
        !profile.roles.administrator
    ) {

        return (

            < >

                <Alert severity="error">

                    Vous n'êtes pas autorisé à importer des données.

                </Alert>

            </>


        );

    }

    /*
     * ============================================================
     * SELECTION FICHIER
     * ============================================================
     */

    function handleChooseFile() {

        fileInputRef.current?.click();

    }

    async function handleFileChange(
        event:
            React.ChangeEvent<HTMLInputElement>,
    ) {

        const file =
            event.target.files?.[0];

        /*
         * Permet de sélectionner à nouveau
         * exactement le même fichier.
         */
        event.target.value =
            "";

        if (!file) {

            return;

        }

        execution.reset();

        setConfirmationOpen(
            false,
        );

        await analysis.analyzeFile(
            file,
        );

    }

    /*
     * ============================================================
     * RESET
     * ============================================================
     */

    function handleReset() {

        analysis.reset();

        execution.reset();

        setConfirmationOpen(
            false,
        );

    }

    /*
     * ============================================================
     * CONFIRMATION
     * ============================================================
     */

    function handleOpenConfirmation() {

        if (
            !analysis.data
            ||
            !analysis.result
            ||
            !analysis.result.valid
            ||
            analysis.result.statistics.conflicts >
            0
            ||
            analysis.result.statistics.creates ===
            0
        ) {

            return;

        }

        setConfirmationOpen(
            true,
        );

    }

    /*
     * ============================================================
     * EXECUTION
     * ============================================================
     */

    async function handleConfirmImport() {

        if (
            !analysis.data
        ) {

            return;

        }

        setConfirmationOpen(
            false,
        );

        try {

            await execution.execute(
                analysis.data,
            );

            /*
             * Important :
             *
             * On réanalyse immédiatement le fichier
             * après l'import.
             *
             * Les CREATE doivent normalement
             * devenir des SKIP.
             */
            await analysis.reanalyze();

        }
        catch {

            /*
             * L'erreur est exposée
             * par useExecuteSeasonImportV2.
             */

        }

    }

    /*
     * ============================================================
     * ETAT
     * ============================================================
     */

    const loading =
        analysis.loading
        ||
        execution.loading;

    const canImport =
        analysis.data !== null
        &&
        analysis.result !== null
        &&
        analysis.result.valid
        &&
        analysis.result.statistics.conflicts ===
        0
        &&
        analysis.result.statistics.creates >
        0
        &&
        !loading;

    const nothingToImport =
        analysis.result !== null
        &&
        analysis.result.valid
        &&
        analysis.result.statistics.conflicts ===
        0
        &&
        analysis.result.statistics.creates ===
        0;

    /*
     * ============================================================
     * PAGE
     * ============================================================
     */

    return (

        <>

            <Stack spacing={3}>


                <>

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

                    <Stack spacing={0.5}>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Import incrémental

                        </Typography>

                        <Typography
                            color="text.secondary"
                        >

                            Import poule par poule ou ajout de matchs

                        </Typography>

                    </Stack>

                </>

                <Alert severity="info">

                    L'import incrémental ne modifie jamais
                    un document existant.

                    {" "}

                    Seuls les éléments identifiés comme
                    « À créer » seront écrits dans Firestore.

                </Alert>

                {/*
                 * =================================================
                 * FICHIER
                 * =================================================
                 */}



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

                                Fichier schemaVersion 2

                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >

                                Périmètres acceptés : POOL ou MATCHES.

                            </Typography>

                            <input
                                ref={
                                    fileInputRef
                                }
                                type="file"
                                accept=".json,application/json"
                                hidden
                                onChange={
                                    event => {

                                        void handleFileChange(
                                            event,
                                        );

                                    }
                                }
                            />

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={2}
                            >

                                <Button
                                    variant="contained"
                                    startIcon={
                                        <FileUploadIcon />
                                    }
                                    disabled={
                                        loading
                                    }
                                    onClick={
                                        handleChooseFile
                                    }
                                >

                                    Sélectionner un fichier

                                </Button>

                                {
                                    analysis.data && (

                                        <Button
                                            variant="outlined"
                                            disabled={
                                                loading
                                            }
                                            onClick={
                                                handleReset
                                            }
                                        >

                                            Réinitialiser

                                        </Button>

                                    )
                                }

                            </Stack>

                            {
                                analysis.fileName && (

                                    <>

                                        <Divider />

                                        <Typography
                                            variant="body2"
                                        >

                                            <strong>
                                                Fichier :
                                            </strong>

                                            {" "}

                                            {
                                                analysis.fileName
                                            }

                                        </Typography>

                                    </>

                                )
                            }

                        </Stack>

                    </CardContent>

                </Card>

                {/*
                 * =================================================
                 * CHARGEMENT
                 * =================================================
                 */}

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

                                {
                                    execution.loading
                                        ? "Import Firestore en cours..."
                                        : "Analyse des données Firestore..."
                                }

                            </Typography>

                        </Stack>

                    )
                }

                {/*
                 * =================================================
                 * ERREUR ANALYSE
                 * =================================================
                 */}

                {
                    analysis.error && (

                        <Alert severity="error">

                            {
                                analysis.error ===
                                    "IMPORT_JSON_INVALID"

                                    ? "Le fichier sélectionné n'est pas un JSON valide."

                                    : analysis.error ===
                                        "IMPORT_V2_SCHEMA_INVALID"

                                        ? "Le fichier n'utilise pas schemaVersion 2."

                                        : analysis.error ===
                                            "IMPORT_V2_SCOPE_INVALID"

                                            ? "Le périmètre doit être POOL ou MATCHES."

                                            : "Impossible d'analyser le fichier."
                            }

                        </Alert>

                    )
                }

                {/*
                 * =================================================
                 * ERREUR EXECUTION
                 * =================================================
                 */}

                {
                    execution.error && (

                        <Alert severity="error">

                            {
                                execution.error ===
                                    "IMPORT_V2_CONFLICT"

                                    ? "L'import a été interrompu car l'état de Firestore a changé ou un conflit a été détecté."

                                    : execution.error ===
                                        "Missing or insufficient permissions."

                                        ? "Firestore a refusé l'écriture. Vérifiez les Security Rules."

                                        : "Une erreur est survenue pendant l'import."
                            }

                        </Alert>

                    )
                }

                {/*
                 * =================================================
                 * CONTEXTE
                 * =================================================
                 */}

                {
                    analysis.data
                    &&
                    analysis.result
                    &&
                    !analysis.loading
                    && (

                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                            }}
                        >

                            <CardContent>

                                <Stack spacing={1}>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    >

                                        Import détecté

                                    </Typography>

                                    <Typography>

                                        Périmètre :

                                        {" "}

                                        <strong>
                                            {
                                                analysis
                                                    .data
                                                    .scope
                                            }
                                        </strong>

                                    </Typography>

                                    <Typography>

                                        Saison :

                                        {" "}

                                        {
                                            analysis
                                                .data
                                                .seasonId
                                        }

                                    </Typography>

                                    <Typography>

                                        Compétition :

                                        {" "}

                                        {
                                            analysis
                                                .data
                                                .competitionId
                                        }

                                    </Typography>

                                    {
                                        analysis.data.scope ===
                                            "POOL"

                                            ? (

                                                <Typography>

                                                    Poule :

                                                    {" "}

                                                    {
                                                        analysis
                                                            .data
                                                            .pool
                                                            .name
                                                    }

                                                </Typography>

                                            )

                                            : (

                                                <Typography>

                                                    Poule :

                                                    {" "}

                                                    {
                                                        analysis
                                                            .data
                                                            .poolId
                                                    }

                                                </Typography>

                                            )
                                    }

                                </Stack>

                            </CardContent>

                        </Card>

                    )
                }

                {/*
                 * =================================================
                 * RAPPORT ANALYSE
                 * =================================================
                 */}

                {
                    analysis.result
                    &&
                    !analysis.loading
                    && (

                        <ImportV2AnalysisSummary
                            result={
                                analysis.result
                            }
                        />

                    )
                }

                {/*
                 * =================================================
                 * RIEN A IMPORTER
                 * =================================================
                 */}

                {
                    nothingToImport
                    &&
                    !execution.result
                    && (

                        <Alert severity="success">

                            Toutes les données de ce fichier
                            sont déjà présentes dans Firestore.

                            {" "}

                            Aucune donnée n'est à importer.

                        </Alert>

                    )
                }

                {/*
                 * =================================================
                 * IMPORT POSSIBLE
                 * =================================================
                 */}

                {
                    canImport && (

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

                                        Import Firestore

                                    </Typography>

                                    <Typography>

                                        {
                                            analysis
                                                .result
                                                ?.statistics
                                                .creates
                                        }

                                        {" "}

                                        document(s) seront créés.

                                    </Typography>

                                    <Alert severity="warning">

                                        Les documents déjà présents
                                        seront ignorés.

                                        {" "}

                                        Aucun document existant
                                        ne sera modifié.

                                    </Alert>

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <PublishIcon />
                                        }
                                        disabled={
                                            !canImport
                                        }
                                        onClick={
                                            handleOpenConfirmation
                                        }
                                    >

                                        Importer les données

                                    </Button>

                                </Stack>

                            </CardContent>

                        </Card>

                    )
                }

                {/*
                 * =================================================
                 * RESULTAT EXECUTION
                 * =================================================
                 */}

                {
                    execution.result && (

                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                            }}
                        >

                            <CardContent>

                                <Stack spacing={2}>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            alignItems:
                                                "center",
                                        }}
                                    >

                                        <CheckCircleIcon
                                            color="success"
                                        />

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >

                                            Import terminé

                                        </Typography>

                                    </Stack>

                                    <Divider />

                                    <ResultLine
                                        label="Créés"
                                        value={
                                            execution
                                                .result
                                                .statistics
                                                .created
                                        }
                                    />

                                    <ResultLine
                                        label="Déjà présents"
                                        value={
                                            execution
                                                .result
                                                .statistics
                                                .skipped
                                        }
                                    />

                                    <ResultLine
                                        label="Dépendances"
                                        value={
                                            execution
                                                .result
                                                .statistics
                                                .dependencies
                                        }
                                    />

                                    <Alert severity="success">

                                        L'import s'est terminé sans
                                        modifier les documents déjà présents.

                                    </Alert>

                                </Stack>

                            </CardContent>

                        </Card>

                    )
                }

            </Stack>

            {/*
             * ====================================================
             * DIALOG CONFIRMATION
             * ====================================================
             */}

            <Dialog
                open={
                    confirmationOpen
                }
                onClose={
                    execution.loading
                        ? undefined
                        : () =>
                            setConfirmationOpen(
                                false,
                            )
                }
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>

                    Confirmer l'import

                </DialogTitle>

                <DialogContent>

                    <Stack
                        spacing={2}
                        sx={{
                            pt: 1,
                        }}
                    >

                        <Typography>

                            Vous êtes sur le point de créer :

                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            {
                                analysis
                                    .result
                                    ?.statistics
                                    .creates
                                ??
                                0
                            }

                            {" "}

                            document(s)

                        </Typography>

                        {
                            analysis.data?.scope ===
                            "POOL"
                            && (

                                <Typography>

                                    Poule :

                                    {" "}

                                    <strong>

                                        {
                                            analysis
                                                .data
                                                .pool
                                                .name
                                        }

                                    </strong>

                                </Typography>

                            )
                        }

                        <Alert severity="info">

                            Une nouvelle analyse Firestore sera
                            effectuée immédiatement avant l'écriture.

                        </Alert>

                        <Alert severity="warning">

                            Aucun document existant ne sera modifié.

                            {" "}

                            Si un conflit apparaît entre-temps,
                            l'import sera interrompu.

                        </Alert>

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button
                        disabled={
                            execution.loading
                        }
                        onClick={() =>
                            setConfirmationOpen(
                                false,
                            )
                        }
                    >

                        Annuler

                    </Button>

                    <Button
                        variant="contained"
                        disabled={
                            execution.loading
                        }
                        onClick={() => {

                            void handleConfirmImport();

                        }}
                    >

                        Confirmer l'import

                    </Button>

                </DialogActions>

            </Dialog>

        </>

    );

}

interface ResultLineProps {

    label: string;

    value: number;

}

function ResultLine({

    label,

    value,

}: ResultLineProps) {

    return (

        <Stack
            direction="row"
            sx={{
                justifyContent:
                    "space-between",

                gap: 2,
            }}
        >

            <Typography
                color="text.secondary"
            >

                {label}

            </Typography>

            <Typography
                sx={{
                    fontWeight: 700,
                }}
            >

                {value}

            </Typography>

        </Stack>

    );

}

export default ImportSeasonV2Page;