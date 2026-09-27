import {
    Alert,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import PeopleIcon
    from "@mui/icons-material/People";

import StorefrontIcon
    from "@mui/icons-material/Storefront";

import EmojiEventsIcon
    from "@mui/icons-material/EmojiEvents";

import SportsEsportsIcon
    from "@mui/icons-material/SportsEsports";

import GroupsIcon
    from "@mui/icons-material/Groups";

import HowToRegIcon
    from "@mui/icons-material/HowToReg";

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

import UploadFileIcon
    from "@mui/icons-material/UploadFile";

import DownloadIcon
    from "@mui/icons-material/Download";

import SettingsIcon
    from "@mui/icons-material/Settings";

import ConstructionIcon
    from "@mui/icons-material/Construction";

import HistoryIcon
    from "@mui/icons-material/History";

import {
    useNavigate,
} from "react-router-dom";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    AdministrationLayout,
} from "../layout/AdministrationLayout";

import {
    AdministrationCard,
} from "../components/AdministrationCard/AdministrationCard";

import {
    ADMINISTRATION_MENU,
} from "../model/administration-menu";

import type {
    AdministrationMenuItem,
    AdministrationSection,
} from "../model/administration-menu";

const SECTION_LABELS:
    Record<
        AdministrationSection,
        string
    > = {

    USERS:
        "Utilisateurs",

    VENUES:
        "Établissements",

    CHAMPIONSHIPS:
        "Championnats",

    DATA:
        "Données",

    SYSTEM:
        "Système",

};

const SECTION_ORDER:
    AdministrationSection[] = [

        "USERS",

        "VENUES",

        "CHAMPIONSHIPS",

        "DATA",

        "SYSTEM",

    ];

function getIcon(
    item: AdministrationMenuItem,
) {

    switch (item.id) {

        case "users":
            return <PeopleIcon />;

        case "venues":
            return <StorefrontIcon />;

        case "seasons":
            return <EmojiEventsIcon />;

        case "competitions":
            return <SportsEsportsIcon />;

        case "pools":
            return <GroupsIcon />;

        case "registrations":
            return <HowToRegIcon />;

        case "match-days":
            return <CalendarMonthIcon />;

        case "matches":
            return <SportsEsportsIcon />;

        case "import":
            return <UploadFileIcon />;

        case "export":
            return <DownloadIcon />;

        case "settings":
            return <SettingsIcon />;

        case "maintenance":
            return <ConstructionIcon />;

        case "audit":
            return <HistoryIcon />;

        default:
            return <SettingsIcon />;

    }

}

export function AdministrationPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    /*
     * ------------------------------------------------------------
     * Protection UI
     * ------------------------------------------------------------
     *
     * Les Security Rules Firestore resteront
     * la véritable protection des données.
     */

    if (
        !profile
        ||
        !profile.roles.administrator
    ) {

        return (

            <AdministrationLayout>

                <Alert severity="error">

                    Vous n'êtes pas autorisé à accéder à l'administration.

                </Alert>

            </AdministrationLayout>

        );

    }

    return (

        <AdministrationLayout>

            <Alert severity="info">

                Le nouveau module d'administration est en cours de construction.
                Les fonctions seront activées progressivement.

            </Alert>

            {
                SECTION_ORDER.map(
                    section => {

                        const items =
                            ADMINISTRATION_MENU.filter(
                                item =>
                                    item.section ===
                                    section,
                            );

                        return (

                            <Stack
                                key={
                                    section
                                }
                                spacing={2}
                            >

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        alignItems:
                                            "center",
                                    }}
                                >

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight:
                                                700,
                                        }}
                                    >

                                        {
                                            SECTION_LABELS[
                                            section
                                            ]
                                        }

                                    </Typography>

                                    <Divider
                                        sx={{
                                            flexGrow:
                                                1,
                                        }}
                                    />

                                </Stack>

                                <Stack spacing={1.5}>

                                    {
                                        items.map(
                                            item => (

                                                <AdministrationCard

                                                    key={
                                                        item.id
                                                    }

                                                    title={
                                                        item.title
                                                    }

                                                    description={
                                                        item.description
                                                    }

                                                    icon={
                                                        getIcon(
                                                            item,
                                                        )
                                                    }

                                                    enabled={
                                                        item.enabled
                                                    }

                                                    onClick={() => {

                                                        if (
                                                            item.enabled
                                                            &&
                                                            item.route
                                                        ) {

                                                            navigate(
                                                                item.route,
                                                            );

                                                        }

                                                    }}

                                                />

                                            ),
                                        )
                                    }

                                </Stack>

                            </Stack>

                        );

                    },
                )
            }

        </AdministrationLayout>

    );

}

export default AdministrationPage;