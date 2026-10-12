import {
    Alert,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import type {
    SeasonImportV2Action,
    SeasonImportV2AnalysisItem,
    SeasonImportV2AnalysisResult,
} from "../model/season-import-v2.types";

interface Props {

    result:
    SeasonImportV2AnalysisResult;

}

function getActionLabel(
    action: SeasonImportV2Action,
): string {

    switch (action) {

        case "DEPENDENCY":
            return "Dépendance";

        case "CREATE":
            return "À créer";

        case "SKIP":
            return "Déjà présent";

        case "CONFLICT":
            return "Conflit";

    }

}

function getActionColor(
    action: SeasonImportV2Action,
):
    | "default"
    | "info"
    | "success"
    | "error" {

    switch (action) {

        case "DEPENDENCY":
            return "info";

        case "CREATE":
            return "success";

        case "SKIP":
            return "default";

        case "CONFLICT":
            return "error";

    }

}

function getEntityLabel(
    item: SeasonImportV2AnalysisItem,
): string {

    switch (item.entityType) {

        case "SEASON":
            return "Saison";

        case "COMPETITION":
            return "Compétition";

        case "POOL":
            return "Poule";

        case "REGISTRATION":
            return "Inscription";

        case "MATCHDAY":
            return "Journée";

        case "MATCH":
            return "Match";

    }

}

export function ImportV2AnalysisSummary({

    result,

}: Props) {

    return (

        <Stack spacing={3}>

            {
                result.valid
                    ? (

                        <Alert severity="success">

                            L'analyse incrémentale est valide.
                            Aucun conflit bloquant n'a été détecté.

                        </Alert>

                    )
                    : (

                        <Alert severity="error">

                            L'import incrémental contient des erreurs
                            ou des conflits.

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

                            Résumé de l'analyse

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
                                label="Dépendances"
                                value={
                                    result.statistics.dependencies
                                }
                            />

                            <Counter
                                label="À créer"
                                value={
                                    result.statistics.creates
                                }
                            />

                            <Counter
                                label="Déjà présents"
                                value={
                                    result.statistics.skips
                                }
                            />

                            <Counter
                                label="Conflits"
                                value={
                                    result.statistics.conflicts
                                }
                            />

                        </Stack>

                    </Stack>

                </CardContent>

            </Card>

            {
                result.issues.length > 0 && (

                    <Stack spacing={1.5}>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Erreurs

                        </Typography>

                        {
                            result.issues.map(
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

            <Stack spacing={1.5}>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                    }}
                >

                    Détail

                </Typography>

                {
                    result.items.map(
                        item => (

                            <Card
                                key={
                                    `${item.entityType}-${item.id}`
                                }
                                variant="outlined"
                                sx={{
                                    borderRadius: 2,
                                }}
                            >

                                <CardContent>

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
                                                xs: "flex-start",
                                                sm: "center",
                                            },
                                        }}
                                    >

                                        <Stack spacing={0.5}>

                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            >

                                                {item.label}

                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >

                                                {
                                                    getEntityLabel(
                                                        item,
                                                    )
                                                }

                                                {" — "}

                                                {item.id}

                                            </Typography>

                                            {
                                                item.message && (

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >

                                                        {item.message}

                                                    </Typography>

                                                )
                                            }

                                        </Stack>

                                        <Chip
                                            size="small"
                                            color={
                                                getActionColor(
                                                    item.action,
                                                )
                                            }
                                            label={
                                                getActionLabel(
                                                    item.action,
                                                )
                                            }
                                        />

                                    </Stack>

                                </CardContent>

                            </Card>

                        ),
                    )
                }

            </Stack>

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
                minWidth: 120,
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

export default ImportV2AnalysisSummary;