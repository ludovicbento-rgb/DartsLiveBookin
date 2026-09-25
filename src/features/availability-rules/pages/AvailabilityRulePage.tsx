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

import DeleteVenueClosureDialog
    from "../components/DeleteVenueClosureDialog";

import {
    deleteVenueClosureCommand,
} from "@/features/commands/deleteVenueClosure";

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

import {
    useVenueClosures,
} from "../hooks/useVenueClosures";

import VenueClosureCard
    from "../components/VenueClosureCard";

import VenueClosureDrawer
    from "../components/VenueClosureDrawer";

import type {
    VenueClosureForm,
} from "../components/VenueClosureDrawer";

import {
    createVenueClosureCommand,
} from "@/features/commands/createVenueClosure";

import type {
    VenueClosure,
} from "@/entities/venue-closure";

import {
    updateVenueClosureCommand,
} from "@/features/commands/updateVenueClosure";

import {
    setVenueClosureActiveCommand,
} from "@/features/commands/setVenueClosureActive";

import {
    BackButton,
} from "@/shared/ui";

import {
    venueSettingsRoute,
} from "@/shared/routing";

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

    const [
        closureDrawerOpen,
        setClosureDrawerOpen,
    ] = useState(false);

    const [
        savingClosure,
        setSavingClosure,
    ] = useState(false);

    const [
        closureToDelete,
        setClosureToDelete,
    ] = useState<VenueClosure | null>(
        null,
    );

    const [
        deletingClosure,
        setDeletingClosure,
    ] = useState(false);

    const [
        selectedClosure,
        setSelectedClosure,
    ] = useState<VenueClosure | null>(
        null,
    );

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


    const {

        closures,

        loading:
        closuresLoading,

        error:
        closuresError,

        reload:
        reloadClosures,

    } = useVenueClosures(
        venueId,
    );

    function handleClosureDeleteRequested(
        closure: VenueClosure,
    ) {

        setClosureToDelete(
            closure,
        );

    }

    function handleCreateRequested() {

        setSelectedRule(
            null,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleClosureEditRequested(
        closure: VenueClosure,
    ) {

        setSelectedClosure(
            closure,
        );

        setClosureDrawerOpen(
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

    async function handleClosureDeleteConfirmed() {

        if (!closureToDelete) {

            return;

        }

        try {

            setDeletingClosure(
                true,
            );

            await deleteVenueClosureCommand(
                closureToDelete.id,
            );

            await reloadClosures();

            setClosureToDelete(
                null,
            );

        }
        catch (error) {

            console.error(
                "DELETE_VENUE_CLOSURE_FAILED",
                error,
            );

        }
        finally {

            setDeletingClosure(
                false,
            );

        }

    }

    async function handleClosureActiveChanged(

        closure: VenueClosure,

        active: boolean,

    ) {

        try {

            setSavingClosure(true);

            await setVenueClosureActiveCommand(

                closure.id,

                active,

            );

            await reloadClosures();

        }
        catch (error) {

            console.error(
                "SET_VENUE_CLOSURE_ACTIVE_FAILED",
                error,
            );

        }
        finally {

            setSavingClosure(false);

        }

    }

    async function handleUpdateClosure(

        closureId: string,

        form: VenueClosureForm,

    ) {

        try {

            setSavingClosure(true);

            const startDate =
                new Date(
                    `${form.startDate}T00:00:00`,
                );

            const endDate =
                new Date(
                    `${form.endDate}T23:59:59.999`,
                );

            await updateVenueClosureCommand(

                closureId,

                {
                    reasonType:
                        form.reasonType,

                    comment:
                        form.comment.trim(),

                    startDate,

                    endDate,
                },

            );

            await reloadClosures();

            setClosureDrawerOpen(false);

            setSelectedClosure(null);

        }
        catch (error) {

            console.error(
                "UPDATE_VENUE_CLOSURE_FAILED",
                error,
            );

        }
        finally {

            setSavingClosure(false);

        }

    }


    async function handleCreateClosure(

        form: VenueClosureForm,

    ) {

        try {

            setSavingClosure(
                true,
            );

            const startDate =
                new Date(
                    `${form.startDate}T00:00:00`,
                );

            const endDate =
                new Date(
                    `${form.endDate}T23:59:59.999`,
                );

            await createVenueClosureCommand({

                venueId,

                reasonType:
                    form.reasonType,

                comment:
                    form.comment,

                startDate,

                endDate,

            });

            await reloadClosures();

            setClosureDrawerOpen(
                false,
            );

        }
        catch (error) {

            console.error(
                "CREATE_VENUE_CLOSURE_FAILED",
                error,
            );

        }
        finally {

            setSavingClosure(
                false,
            );

        }

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
                            <BackButton
                                to={
                                    venueSettingsRoute()
                                }
                                label="Retour aux paramètres"
                            />

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

                    <Stack
                        spacing={2}
                        sx={{
                            pt: 3,
                            width: "100%",
                        }}
                    >

                        {/* Header */}
                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                            sx={{
                                width: "100%",

                                justifyContent:
                                    "space-between",

                                alignItems: {
                                    xs: "stretch",
                                    sm: "flex-start",
                                },
                            }}
                        >

                            {/* Titre + description */}
                            <Stack
                                spacing={0.5}
                                sx={{
                                    minWidth: 0,
                                    flex: 1,
                                }}
                            >

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >

                                    Fermetures exceptionnelles

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Gérez les périodes pendant
                                    lesquelles l'établissement est
                                    totalement fermé aux réservations.

                                </Typography>

                            </Stack>

                            {/* Bouton */}
                            <Button

                                variant="contained"

                                startIcon={
                                    <AddIcon />
                                }

                                onClick={() => {

                                    setSelectedClosure(null);

                                    setClosureDrawerOpen(true);

                                }}

                                sx={{
                                    flexShrink: 0,

                                    alignSelf: {
                                        xs: "stretch",
                                        sm: "flex-start",
                                    },

                                    whiteSpace: "nowrap",
                                }}

                            >

                                Nouvelle fermeture

                            </Button>

                        </Stack>

                        {/* Chargement */}
                        {
                            closuresLoading && (

                                <Stack
                                    sx={{
                                        alignItems: "center",
                                        py: 2,
                                    }}
                                >

                                    <CircularProgress />

                                </Stack>

                            )
                        }

                        {/* Erreur */}
                        {
                            closuresError && (

                                <Alert
                                    severity="error"
                                    sx={{
                                        width: "100%",
                                    }}
                                >

                                    {closuresError}

                                </Alert>

                            )
                        }

                        {/* Aucune fermeture */}
                        {
                            !closuresLoading
                            &&
                            !closuresError
                            &&
                            closures.length === 0
                            &&
                            (

                                <Alert
                                    severity="info"
                                    sx={{
                                        width: "100%",
                                    }}
                                >

                                    Aucune fermeture exceptionnelle
                                    n'est configurée.

                                </Alert>

                            )
                        }

                        {/* Liste des fermetures */}
                        {
                            !closuresLoading
                            &&
                            !closuresError
                            &&
                            closures.map(

                                closure => (

                                    <VenueClosureCard

                                        key={closure.id}

                                        closure={closure}

                                        loading={
                                            savingClosure
                                        }

                                        onEdit={
                                            handleClosureEditRequested
                                        }

                                        onActiveChanged={
                                            handleClosureActiveChanged
                                        }

                                        onDelete={
                                            handleClosureDeleteRequested
                                        }


                                    />

                                ),

                            )
                        }

                    </Stack>
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

            <VenueClosureDrawer

                open={closureDrawerOpen}

                loading={savingClosure}

                closure={selectedClosure}

                onClose={() => {

                    if (savingClosure) {

                        return;

                    }

                    setClosureDrawerOpen(false);

                    setSelectedClosure(null);

                }}

                onCreate={
                    handleCreateClosure
                }

                onUpdate={
                    handleUpdateClosure
                }


            />

            <DeleteVenueClosureDialog

                open={
                    closureToDelete !== null
                }

                closure={
                    closureToDelete
                }

                loading={
                    deletingClosure
                }

                onClose={() => {

                    if (deletingClosure) {

                        return;

                    }

                    setClosureToDelete(
                        null,
                    );

                }}

                onConfirm={
                    handleClosureDeleteConfirmed
                }

            />

        </AppLayout>

    );

}

export default AvailabilityRulesPage;