import {
    Alert,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import CheckCircleIcon
    from "@mui/icons-material/CheckCircle";

import ErrorIcon
    from "@mui/icons-material/Error";

import type {
    SeasonImportValidationResult,
} from "../model/season-import.types";

interface Props {

    result:
    SeasonImportValidationResult;

}

export function ImportValidationSummary({

    result,

}: Props) {

    const errors =
        result.issues.filter(
            issue =>
                issue.severity ===
                "ERROR",
        );

    const warnings =
        result.issues.filter(
            issue =>
                issue.severity ===
                "WARNING",
        );

    return (

        <Stack spacing={3}>

            {
                result.valid
                    ? (

                        <Alert
                            severity="success"
                            icon={
                                <CheckCircleIcon />
                            }
                        >

                            Le fichier est valide et peut être importé.

                        </Alert>

                    )
                    : (

                        <Alert
                            severity="error"
                            icon={
                                <ErrorIcon />
                            }
                        >

                            Le fichier contient des erreurs.
                            Aucun import ne sera autorisé.

                        </Alert>

                    )
            }

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

                            Contenu détecté

                        </Typography>

                        <Divider />

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={3}
                            sx={{
                                flexWrap: "wrap",
                            }}
                        >

                            <Counter
                                label="Compétitions"
                                value={
                                    result
                                        .statistics
                                        .competitions
                                }
                            />

                            <Counter
                                label="Poules"
                                value={
                                    result
                                        .statistics
                                        .pools
                                }
                            />

                            <Counter
                                label="Inscriptions"
                                value={
                                    result
                                        .statistics
                                        .registrations
                                }
                            />

                            <Counter
                                label="Journées"
                                value={
                                    result
                                        .statistics
                                        .matchDays
                                }
                            />

                            <Counter
                                label="Matchs"
                                value={
                                    result
                                        .statistics
                                        .matches
                                }
                            />

                        </Stack>

                    </Stack>

                </CardContent>

            </Card>

            {
                errors.length > 0 && (

                    <Stack spacing={1.5}>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Erreurs ({errors.length})

                        </Typography>

                        {
                            errors.map(
                                (
                                    issue,
                                    index,
                                ) => (

                                    <Alert
                                        key={
                                            `${issue.code}-${issue.path ?? index}`
                                        }
                                        severity="error"
                                    >

                                        <Stack spacing={0.5}>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            >

                                                {issue.message}

                                            </Typography>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{
                                                    flexWrap: "wrap",
                                                }}
                                            >

                                                <Chip
                                                    size="small"
                                                    label={
                                                        issue.code
                                                    }
                                                />

                                                {
                                                    issue.path && (

                                                        <Chip
                                                            size="small"
                                                            variant="outlined"
                                                            label={
                                                                issue.path
                                                            }
                                                        />

                                                    )
                                                }

                                            </Stack>

                                        </Stack>

                                    </Alert>

                                ),
                            )
                        }

                    </Stack>

                )
            }

            {
                warnings.length > 0 && (

                    <Stack spacing={1.5}>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Avertissements ({warnings.length})

                        </Typography>

                        {
                            warnings.map(
                                (
                                    issue,
                                    index,
                                ) => (

                                    <Alert
                                        key={
                                            `${issue.code}-${issue.path ?? index}`
                                        }
                                        severity="warning"
                                    >

                                        {issue.message}

                                    </Alert>

                                ),
                            )
                        }

                    </Stack>

                )
            }

        </Stack>

    );

}

interface CounterProps {

    label: string;

    value: number;

}

function Counter({

    label,

    value,

}: CounterProps) {

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

export default ImportValidationSummary;