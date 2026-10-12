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
    ImportValidationSummary,
} from "../components/ImportValidationSummary";

import {
    ImportCollisionSummary,
} from "../components/ImportCollisionSummary";

import {
    useSeasonImportAnalysis,
} from "../hooks/useSeasonImportAnalysis";

import {
    useSeasonImportCollisions,
} from "../hooks/useSeasonImportCollisions";

import {
    useExecuteSeasonImport,
} from "../hooks/useExecuteSeasonImport";

interface ImportSeasonPageProps {

    initialFile: File;

}

export function ImportSeasonPage({

    initialFile,

}: ImportSeasonPageProps) {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const analysis =
        useSeasonImportAnalysis();

    const collisions =
        useSeasonImportCollisions();

    const execution =
        useExecuteSeasonImport();

    const fileInputRef =
        useRef<HTMLInputElement | null>(
            null,
        );

    const [
        confirmationOpen,
        setConfirmationOpen,
    ] = useState(false);

    useEffect(() => {

        collisions.reset();
        execution.reset();

        void analysis.analyzeFile(
            initialFile,
        );

        // Le fichier ne change que lorsque
        // le parent en sélectionne un nouveau.
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

            <>

                <Alert severity="error">

                    Vous n'êtes pas autorisé à importer des données.

                </Alert>

            </>

        );
    }

    /*
     * ============================================================
     * FICHIER
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

        event.target.value =
            "";

        if (!file) {
            return;
        }

        collisions.reset();
        execution.reset();

        await analysis.analyzeFile(
            file,
        );

    }

    function handleReset() {

        analysis.reset();
        collisions.reset();
        execution.reset();

        setConfirmationOpen(
            false,
        );

    }

    /*
     * ============================================================
     * PREPARATION IMPORT
     * ============================================================
     */

    async function handlePrepareImport() {

        if (
            !analysis.data
            ||
            !analysis.result?.valid
        ) {

            return;

        }

        execution.reset();

        const collisionResult =
            await collisions.check(
                analysis.data,
            );

        /*
         * Aucun conflit :
         * on peut demander confirmation.
         */
        if (
            !collisionResult.hasCollisions
        ) {

            setConfirmationOpen(
                true,
            );

        }

    }

    /*
     * ============================================================
     * IMPORT REEL
     * ============================================================
     */

    async function handleConfirmImport() {

        if (!analysis.data) {
            return;
        }

        setConfirmationOpen(
            false,
        );

        try {

            await execution.execute(
                analysis.data,
            );

        }
        catch {

            /*
             * L'erreur est déjà exposée
             * par useExecuteSeasonImport.
             */

        }

    }

    const canPrepareImport =
        analysis.data !== null
        &&
        analysis.result?.valid === true
        &&
        !analysis.loading
        &&
        !collisions.loading
        &&
        !execution.loading;

    /*
     * ============================================================
     * SUCCES
     * ============================================================
     */

    if (
        execution.result
        &&
        analysis.data
    ) {

        return (

            <
                >

                <Stack spacing={3}>

                    <Stack
                        spacing={2}
                        sx={{
                            alignItems:
                                "center",

                            textAlign:
                                "center",

                            py: 4,
                        }}
                    >

                        <CheckCircleIcon
                            color="success"
                            sx={{
                                fontSize: 64,
                            }}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Import terminé

                        </Typography>

                        <Typography
                            color="text.secondary"
                        >

                            {
                                analysis
                                    .data
                                    .season
                                    .name
                            }

                        </Typography>

                    </Stack>

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

                                    Résultat

                                </Typography>

                                <Divider />

                                <ResultLine
                                    label="Saison"
                                    value={
                                        execution
                                            .result
                                            .seasonId
                                    }
                                />

                                <ResultLine
                                    label="Compétitions"
                                    value={
                                        execution
                                            .result
                                            .competitions
                                    }
                                />

                                <ResultLine
                                    label="Poules"
                                    value={
                                        execution
                                            .result
                                            .pools
                                    }
                                />

                                <ResultLine
                                    label="Inscriptions"
                                    value={
                                        execution
                                            .result
                                            .registrations
                                    }
                                />

                                <ResultLine
                                    label="Journées"
                                    value={
                                        execution
                                            .result
                                            .matchDays
                                    }
                                />

                                <ResultLine
                                    label="Matchs"
                                    value={
                                        execution
                                            .result
                                            .matches
                                    }
                                />

                                <Divider />

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >

                                    {
                                        execution
                                            .result
                                            .totalDocuments
                                    }

                                    {" "}

                                    document(s) importé(s)

                                </Typography>

                                <Alert severity="info">

                                    La saison importée n'a pas été activée
                                    automatiquement.

                                </Alert>

                                <Alert severity="info">

                                    Tous les matchs importés ont été initialisés
                                    en statut Non planifié, sans réservation associée.

                                </Alert>

                            </Stack>

                        </CardContent>

                    </Card>



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
                            onClick={
                                handleReset
                            }
                        >

                            Importer un autre fichier

                        </Button>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() =>
                                navigate(
                                    "/administration",
                                )
                            }
                        >

                            Retour à l'administration

                        </Button>

                    </Stack>

                </Stack>

            </>

        );

    }

    /*
     * ============================================================
     * PAGE
     * ============================================================
     */

    return (

        <>

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

                    <PublishIcon
                        color="primary"
                    />

                    <Stack>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Importer une saison

                        </Typography>

                        <Typography
                            color="text.secondary"
                        >

                            Validation et import des données du championnat

                        </Typography>

                    </Stack>

                </Stack>

                <Alert severity="info">

                    L'import ne modifie jamais une donnée existante.
                    Toute collision bloque l'opération.

                </Alert>

                {/*
                 * =================================================
                 * SELECTION FICHIER
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

                                Fichier JSON

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
                                        analysis.loading
                                        ||
                                        collisions.loading
                                        ||
                                        execution.loading
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
                                                analysis.loading
                                                ||
                                                collisions.loading
                                                ||
                                                execution.loading
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
                 * CHARGEMENTS
                 * =================================================
                 */}

                {
                    (
                        analysis.loading
                        ||
                        collisions.loading
                        ||
                        execution.loading
                    )
                    && (

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
                                        : collisions.loading
                                            ? "Recherche de collisions..."
                                            : "Analyse du fichier..."
                                }

                            </Typography>

                        </Stack>

                    )
                }

                {/*
                 * =================================================
                 * ERREURS
                 * =================================================
                 */}

                {
                    analysis.error && (

                        <Alert severity="error">

                            {
                                analysis.error ===
                                    "IMPORT_JSON_INVALID"
                                    ? "Le fichier sélectionné n'est pas un JSON valide."
                                    : "Impossible d'analyser le fichier."
                            }

                        </Alert>

                    )
                }

                {
                    collisions.error && (

                        <Alert severity="error">

                            Impossible de vérifier les collisions Firestore.

                        </Alert>

                    )
                }

                {
                    execution.error && (

                        <Alert severity="error">

                            {
                                execution.error ===
                                    "IMPORT_COLLISION"
                                    ? "L'import a été interrompu car une collision a été détectée."
                                    : execution.error ===
                                        "IMPORT_VALIDATION_FAILED"
                                        ? "Le fichier n'est plus valide. L'import a été interrompu."
                                        : "Une erreur est survenue pendant l'import."
                            }

                        </Alert>

                    )
                }

                {/*
                 * =================================================
                 * ANALYSE
                 * =================================================
                 */}

                {
                    analysis.data
                    &&
                    analysis.result
                    &&
                    !analysis.loading
                    && (

                        <>

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

                                            Saison détectée

                                        </Typography>

                                        <Typography
                                            variant="h5"
                                        >

                                            {
                                                analysis
                                                    .data
                                                    .season
                                                    .name
                                            }

                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >

                                            ID :

                                            {" "}

                                            {
                                                analysis
                                                    .data
                                                    .season
                                                    .id
                                            }

                                            {" — "}

                                            Schéma v

                                            {
                                                analysis
                                                    .data
                                                    .schemaVersion
                                            }

                                        </Typography>

                                    </Stack>

                                </CardContent>

                            </Card>

                            <ImportValidationSummary
                                result={
                                    analysis.result
                                }
                            />

                        </>

                    )
                }

                {/*
                 * =================================================
                 * COLLISIONS
                 * =================================================
                 */}

                {
                    collisions.result && (

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

                                        Contrôle Firestore

                                    </Typography>

                                    <ImportCollisionSummary
                                        collisions={
                                            collisions
                                                .result
                                                .collisions
                                        }
                                    />

                                </Stack>

                            </CardContent>

                        </Card>

                    )
                }

                {/*
                 * =================================================
                 * PREPARATION
                 * =================================================
                 */}

                {
                    analysis.data
                    &&
                    analysis.result
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

                                        Import

                                    </Typography>

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <PublishIcon />
                                        }
                                        disabled={
                                            !canPrepareImport
                                            ||
                                            collisions
                                                .result
                                                ?.hasCollisions ===
                                            true
                                        }
                                        onClick={() => {

                                            void handlePrepareImport();

                                        }}
                                    >

                                        Vérifier et préparer l'import

                                    </Button>

                                </Stack>

                            </CardContent>

                        </Card>

                    )
                }

            </Stack>

            {/*
             * ====================================================
             * CONFIRMATION
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

                            Vous allez importer :

                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            {
                                analysis
                                    .data
                                    ?.season
                                    .name
                            }

                        </Typography>

                        {
                            analysis.result && (

                                <Stack spacing={0.5}>

                                    <Typography>

                                        {
                                            analysis
                                                .result
                                                .statistics
                                                .competitions
                                        } compétition(s)

                                    </Typography>

                                    <Typography>

                                        {
                                            analysis
                                                .result
                                                .statistics
                                                .pools
                                        } poule(s)

                                    </Typography>

                                    <Typography>

                                        {
                                            analysis
                                                .result
                                                .statistics
                                                .registrations
                                        } inscription(s)

                                    </Typography>

                                    <Typography>

                                        {
                                            analysis
                                                .result
                                                .statistics
                                                .matchDays
                                        } journée(s)

                                    </Typography>

                                    <Typography>

                                        {
                                            analysis
                                                .result
                                                .statistics
                                                .matches
                                        } match(s)

                                    </Typography>

                                </Stack>

                            )
                        }

                        <Alert severity="warning">

                            Cette opération crée les documents Firestore.
                            La saison importée restera inactive jusqu'à son
                            activation explicite depuis l'administration.

                        </Alert>

                        <Alert severity="info">

                            Tous les matchs seront importés en statut
                            Non planifié et sans réservation.

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

    value:
    string
    | number;

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

export default ImportSeasonPage;