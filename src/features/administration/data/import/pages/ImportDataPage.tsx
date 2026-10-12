import {
    Alert,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import FileUploadIcon
    from "@mui/icons-material/FileUpload";

import {
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    AdministrationLayout,
} from "@/features/administration/layout/AdministrationLayout";

import {
    detectImportFileVersion,
} from "../model/import-file-version";

import type {
    ImportFileHeader,
} from "../model/import-file-version";

import {
    ImportSeasonPage,
} from "./ImportSeasonPage";

import {
    ImportSeasonV2Page,
} from "./ImportSeasonV2Page";

export function ImportDataPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const fileInputRef =
        useRef<HTMLInputElement | null>(
            null,
        );

    const [
        file,
        setFile,
    ] =
        useState<File | null>(
            null,
        );

    const [
        header,
        setHeader,
    ] =
        useState<ImportFileHeader | null>(
            null,
        );

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );

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

                    Vous n'êtes pas autorisé à importer des données.

                </Alert>

            </AdministrationLayout>

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

        const selectedFile =
            event.target.files?.[0];

        event.target.value =
            "";

        if (!selectedFile) {

            return;

        }

        setError(null);
        setFile(null);
        setHeader(null);

        try {

            const text =
                await selectedFile.text();

            let parsed:
                unknown;

            try {

                parsed =
                    JSON.parse(
                        text,
                    );

            }
            catch {

                throw new Error(
                    "IMPORT_JSON_INVALID",
                );

            }

            const detected =
                detectImportFileVersion(
                    parsed,
                );

            setFile(
                selectedFile,
            );

            setHeader(
                detected,
            );

        }
        catch (error) {

            console.error(
                "IMPORT_FILE_DETECTION_FAILED",
                error,
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "IMPORT_FILE_DETECTION_FAILED",
            );

        }

    }

    function reset() {

        setFile(null);
        setHeader(null);
        setError(null);

    }

    /*
     * ============================================================
     * PAGE
     * ============================================================
     */

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

                <Stack spacing={0.5}>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        Importer des données

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        Import complet d'une saison ou import incrémental

                    </Typography>

                </Stack>

                <Alert severity="info">

                    Le type d'import est détecté automatiquement
                    à partir du fichier JSON.

                </Alert>

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
                                    onClick={
                                        handleChooseFile
                                    }
                                >

                                    Sélectionner un fichier

                                </Button>

                                {
                                    file && (

                                        <Button
                                            variant="outlined"
                                            onClick={
                                                reset
                                            }
                                        >

                                            Changer de fichier

                                        </Button>

                                    )
                                }

                            </Stack>

                            {
                                file
                                &&
                                header
                                && (

                                    <>

                                        <Divider />

                                        <Typography>

                                            <strong>
                                                Fichier :
                                            </strong>

                                            {" "}

                                            {file.name}

                                        </Typography>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{
                                                flexWrap:
                                                    "wrap",
                                            }}
                                        >

                                            <Chip
                                                color="primary"
                                                label={
                                                    `Schéma v${header.schemaVersion}`
                                                }
                                            />

                                            <Chip
                                                variant="outlined"
                                                label={
                                                    header.schemaVersion === 1
                                                        ? "Saison complète"
                                                        : header.scope === "POOL"
                                                            ? "Poule"
                                                            : "Matchs"
                                                }
                                            />

                                        </Stack>

                                    </>

                                )
                            }

                        </Stack>

                    </CardContent>

                </Card>

                {
                    error && (

                        <Alert severity="error">

                            {
                                error ===
                                    "IMPORT_JSON_INVALID"

                                    ? "Le fichier sélectionné n'est pas un JSON valide."

                                    : error ===
                                        "IMPORT_V2_SCOPE_INVALID"

                                        ? "Le fichier V2 doit utiliser le périmètre POOL ou MATCHES."

                                        : error ===
                                            "IMPORT_SCHEMA_UNSUPPORTED"

                                            ? "Cette version de fichier d'import n'est pas supportée."

                                            : "Impossible d'identifier le fichier."
                            }

                        </Alert>

                    )
                }

                {
                    file
                    &&
                    header?.schemaVersion === 1
                    && (

                        <ImportSeasonPage
                            initialFile={
                                file
                            }
                        />

                    )
                }

                {
                    file
                    &&
                    header?.schemaVersion === 2
                    && (

                        <ImportSeasonV2Page
                            initialFile={
                                file
                            }
                        />

                    )
                }

            </Stack>

        </AdministrationLayout>

    );

}

export default ImportDataPage;