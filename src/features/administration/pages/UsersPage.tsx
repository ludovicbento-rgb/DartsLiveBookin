import Typography from "@mui/material/Typography";

import { AppLayout } from "@/app/layouts/AppLayout";

import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

export function UsersPage() {

    return (

        <AppLayout>

            <AppCard>

                <PageTitle>

                    Utilisateurs

                </PageTitle>

                <Typography>

                    🚧 En cours de développement

                </Typography>

            </AppCard>

        </AppLayout>

    );

}

export default UsersPage;