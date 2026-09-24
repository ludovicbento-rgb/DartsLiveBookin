import {
    Alert,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import AddIcon
    from "@mui/icons-material/Add";

import {
    useState,
} from "react";

import {
    AppLayout,
} from "@/app/layouts/AppLayout";

import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

import {
    useAvailabilityRules,
} from "../hooks/useAvailabilityRules";

import AvailabilityRuleCard
    from "../components/AvailabilityRuleCard";

import AvailabilityRuleDrawer
    from "../components/AvailabilityRuleDrawer";

import {
    createAvailabilityRuleCommand,
} from "@/features/commands/createAvailabilityRule";

import type {
    AvailabilityRule,
} from "@/entities/availability-rule";

import {
    useParams,
} from "react-router-dom";

import type {
    AvailabilityRuleForm,
} from "../components/AvailabilityRuleDrawer";

import {
    updateAvailabilityRuleCommand,
} from "@/features/commands/updateAvailabilityRule";

import {
    setAvailabilityRuleActiveCommand,
} from "@/features/commands/setAvailabilityRuleActive";

import DeleteAvailabilityRuleDialog
    from "../components/DeleteAvailabilityRuleDialog";

import {
    deleteAvailabilityRuleCommand,
} from "@/features/commands/deleteAvailabilityRule";

export function AvailabilityRulesPage() {

    const {
        venueId: venueIdParam,
    } = useParams<{
        venueId: string;
    }>();

    const venueId =
        venueIdParam ?? "";

    if (!venueId) {

        throw new Error(
            "VENUE_ID_REQUIRED",
        );

    }

    const [
        selectedRule,
        setSelectedRule,
    ] = useState<AvailabilityRule | null>(
        null,
    );

    const [
        ruleToDelete,
        setRuleToDelete,
    ] = useState<AvailabilityRule | null>(
        null,
    );

    const [
        deleting,
        setDeleting,
    ] = useState(false);

    const {

        rules,

        loading,

        error,

        reload,

    } = useAvailabilityRules(

        venueId,

    );

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [

        drawerOpen,

        setDrawerOpen,

    ] = useState(false);

    function handleCreateRequested() {

        setSelectedRule(
            null,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleDeleteRequested(
        rule: AvailabilityRule,
    ) {

        setRuleToDelete(
            rule,
        );

    }

    async function handleActiveChanged(

        rule: AvailabilityRule,

        active: boolean,

    ) {

        try {

            setSaving(true);

            await setAvailabilityRuleActiveCommand(

                rule.id,

                active,

            );

            await reload();

        }
        catch (error) {

            console.error(
                "SET_AVAILABILITY_RULE_ACTIVE_FAILED",
                error,
            );

        }
        finally {

            setSaving(false);

        }

    }

    async function handleUpdate(

        ruleId: string,

        form: AvailabilityRuleForm,

    ) {

        try {

            setSaving(true);

            await updateAvailabilityRuleCommand(

                ruleId,

                form,

            );

            await reload();

            setDrawerOpen(false);

            setSelectedRule(null);

        }
        catch (error) {

            console.error(
                "UPDATE_AVAILABILITY_RULE_FAILED",
                error,
            );

        }
        finally {

            setSaving(false);

        }

    }

    function handleEditRequested(
        rule: AvailabilityRule,
    ) {

        setSelectedRule(
            rule,
        );

        setDrawerOpen(
            true,
        );

    }

    async function handleCreate(
        form: AvailabilityRuleForm,
    ) {

        try {

            setSaving(true);

            await createAvailabilityRuleCommand({

                venueId,

                ...form,

            });

            await reload();

            closeDrawer();

        }
        catch (error) {

            console.error(
                "CREATE_AVAILABILITY_RULE_FAILED",
                error,
            );

        }
        finally {

            setSaving(false);

        }

    }

    async function handleDeleteConfirmed() {

        if (!ruleToDelete) {

            return;

        }

        try {

            setDeleting(true);

            await deleteAvailabilityRuleCommand(
                ruleToDelete.id,
            );

            await reload();

            setRuleToDelete(
                null,
            );

        }
        catch (error) {

            console.error(
                "DELETE_AVAILABILITY_RULE_FAILED",
                error,
            );

        }
        finally {

            setDeleting(false);

        }

    }

    function closeDrawer() {

        setDrawerOpen(false);

    }

    return (

        <AppLayout>

            <AppCard>

                <Stack spacing={3}>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: {
                                xs: "stretch",
                                sm: "flex-start",
                            },
                        }}
                    >

                        <Stack
                            spacing={0.5}
                            sx={{
                                minWidth: 0,
                            }}
                        >

                            <PageTitle>
                                Règles de disponibilité
                            </PageTitle>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Configurez les événements qui rendent
                                l'établissement indisponible de manière
                                récurrente.
                            </Typography>

                        </Stack>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={
                                handleCreateRequested
                            }
                            sx={{
                                flexShrink: 0,
                                alignSelf: {
                                    xs: "stretch",
                                    sm: "flex-start",
                                },
                            }}
                        >
                            Nouvelle règle
                        </Button>

                    </Stack>

                    {

                        loading && (

                            <CircularProgress />

                        )

                    }

                    {

                        error && (

                            <Alert severity="error">

                                {error}

                            </Alert>

                        )

                    }

                    {

                        !loading

                        &&

                        rules.length === 0

                        &&

                        (

                            <Alert severity="info">

                                Aucune règle de disponibilité n'a été créée.
                                Cliquez sur Nouvelle règle pour commencer.

                            </Alert>

                        )

                    }

                    {

                        rules.map(rule => (

                            <AvailabilityRuleCard

                                key={rule.id}

                                rule={rule}

                                loading={saving}

                                onEdit={
                                    handleEditRequested
                                }

                                onActiveChanged={
                                    handleActiveChanged
                                }

                                onDelete={
                                    handleDeleteRequested
                                }

                            />

                        ))

                    }

                </Stack>

            </AppCard>

            <AvailabilityRuleDrawer

                open={drawerOpen}

                loading={saving}

                rule={selectedRule}

                onClose={() => {

                    if (saving) {

                        return;

                    }

                    setDrawerOpen(false);

                    setSelectedRule(null);

                }}

                onCreate={
                    handleCreate
                }

                onUpdate={
                    handleUpdate
                }

            />

            <DeleteAvailabilityRuleDialog

                open={
                    ruleToDelete !== null
                }

                rule={
                    ruleToDelete
                }

                loading={
                    deleting
                }

                onClose={() => {

                    if (deleting) {

                        return;

                    }

                    setRuleToDelete(
                        null,
                    );

                }}

                onConfirm={
                    handleDeleteConfirmed
                }

            />

        </AppLayout>

    );

}

export default AvailabilityRulesPage;