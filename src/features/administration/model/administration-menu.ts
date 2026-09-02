import type { ReactNode } from "react";

export interface AdministrationMenu {

    title: string;

    description: string;

    icon: ReactNode;

    route: string;

    color:
    | "primary"
    | "success"
    | "warning"
    | "info";

}