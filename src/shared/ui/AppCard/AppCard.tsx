import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export function AppCard({
    children,
}: Props) {
    return (
        <Card
            elevation={4}
            sx={{
                maxWidth: 520,
                mx: "auto",
                mt: 6,
                borderRadius: 4,
            }}
        >
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}