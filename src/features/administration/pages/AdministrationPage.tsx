import Stack from "@mui/material/Stack";

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

import StoreIcon
    from "@mui/icons-material/Store";

import PeopleIcon
    from "@mui/icons-material/People";

import EmojiEventsIcon
    from "@mui/icons-material/EmojiEvents";

import GroupsIcon
    from "@mui/icons-material/Groups";

import SportsIcon
    from "@mui/icons-material/Sports";

import UploadFileIcon
    from "@mui/icons-material/UploadFile";

import DownloadIcon
    from "@mui/icons-material/Download";

import { useNavigate } from "react-router-dom";

import { AppLayout } from "@/app/layouts/AppLayout";

import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

import {
    DashboardActionCard,
} from "@/widgets/dashboard/DashboardActionCard";

export function AdministrationPage() {

    const navigate =
        useNavigate();

    return (

        <AppLayout>

            <AppCard>

                <Stack spacing={2}>

                    <PageTitle>

                        Administration

                    </PageTitle>

                    <DashboardActionCard

                        title="Saisons"

                        description="Gestion des saisons"

                        icon={<CalendarMonthIcon />}

                        color="primary"

                        onClick={() =>
                            navigate("/admin/seasons")
                        }

                    />

                    <DashboardActionCard

                        title="Établissements"

                        description="Gestion des bars"

                        icon={<StoreIcon />}

                        color="success"

                        onClick={() =>
                            navigate("/admin/venues")
                        }

                    />

                    <DashboardActionCard

                        title="Utilisateurs"

                        description="Gestion des joueurs"

                        icon={<PeopleIcon />}

                        color="warning"

                        onClick={() =>
                            navigate("/admin/users")
                        }

                    />

                    <DashboardActionCard

                        title="Compétitions"

                        description="Gestion des compétitions"

                        icon={<EmojiEventsIcon />}

                        color="primary"

                        onClick={() =>
                            navigate("/admin/competitions")
                        }

                    />

                    <DashboardActionCard

                        title="Poules"

                        description="Gestion des poules"

                        icon={<GroupsIcon />}

                        color="success"

                        onClick={() =>
                            navigate("/admin/pools")
                        }

                    />

                    <DashboardActionCard

                        title="Doublettes"

                        description="Gestion des équipes"

                        icon={<SportsIcon />}

                        color="warning"

                        onClick={() =>
                            navigate("/admin/registrations")
                        }

                    />

                    <DashboardActionCard

                        title="Import Excel"

                        description="Importer une saison"

                        icon={<UploadFileIcon />}

                        color="success"

                        onClick={() =>
                            navigate("/admin/import")
                        }

                    />

                    <DashboardActionCard

                        title="Export Excel"

                        description="Exporter une saison"

                        icon={<DownloadIcon />}

                        color="primary"

                        onClick={() =>
                            navigate("/admin/export")
                        }

                    />

                    <DashboardActionCard

                        title="Paramètres"

                        description="Gestion des paramètres de l'application"

                        icon={<StoreIcon />}

                        color="success"

                        onClick={() =>
                            navigate("/admin/settings")
                        }

                    />

                </Stack>

            </AppCard>

        </AppLayout>

    );

}

export default AdministrationPage;