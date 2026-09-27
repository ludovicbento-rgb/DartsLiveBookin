export type AdministrationSection =
    | "USERS"
    | "VENUES"
    | "CHAMPIONSHIPS"
    | "DATA"
    | "SYSTEM";

export interface AdministrationMenuItem {

    id: string;

    section: AdministrationSection;

    title: string;

    description: string;

    route?: string;

    enabled: boolean;

}

export const ADMINISTRATION_MENU:
    AdministrationMenuItem[] = [

        /*
         * --------------------------------------------------------
         * Utilisateurs
         * --------------------------------------------------------
         */

        {
            id: "users",
            section: "USERS",
            title: "Utilisateurs",
            description:
                "Comptes, rôles et activations",
            route:
                "/administration/users",
            enabled: true,
        },

        /*
         * --------------------------------------------------------
         * Établissements
         * --------------------------------------------------------
         */

        {
            id: "venues",
            section: "VENUES",
            title: "Établissements",
            description:
                "Bars affiliés, cibles et gérants",
            route:
                "/administration/venues",
            enabled: true,
        },

        /*
         * --------------------------------------------------------
         * Championnats
         * --------------------------------------------------------
         */

        {
            id: "seasons",
            section: "CHAMPIONSHIPS",
            title: "Saisons",
            description:
                "Saisons des championnats",
            route:
                "/administration/seasons",
            enabled: false,
        },

        {
            id: "competitions",
            section: "CHAMPIONSHIPS",
            title: "Compétitions",
            description:
                "Individuel, doublettes et équipes",
            route:
                "/administration/competitions",
            enabled: false,
        },

        {
            id: "pools",
            section: "CHAMPIONSHIPS",
            title: "Poules",
            description:
                "Organisation des poules",
            route:
                "/administration/pools",
            enabled: false,
        },

        {
            id: "registrations",
            section: "CHAMPIONSHIPS",
            title: "Inscriptions",
            description:
                "Joueurs, capitaines et équipes",
            route:
                "/administration/registrations",
            enabled: false,
        },

        {
            id: "match-days",
            section: "CHAMPIONSHIPS",
            title: "Journées",
            description:
                "Journées de championnat",
            route:
                "/administration/match-days",
            enabled: false,
        },

        {
            id: "matches",
            section: "CHAMPIONSHIPS",
            title: "Matchs",
            description:
                "Rencontres des championnats",
            route:
                "/administration/matches",
            enabled: false,
        },

        /*
         * --------------------------------------------------------
         * Données
         * --------------------------------------------------------
         */

        {
            id: "import",
            section: "DATA",
            title: "Importer une saison",
            description:
                "Importer les données d'une saison",
            route:
                "/administration/import",
            enabled: false,
        },

        {
            id: "export",
            section: "DATA",
            title: "Exporter une saison",
            description:
                "Exporter les données d'une saison",
            route:
                "/administration/export",
            enabled: false,
        },

        /*
         * --------------------------------------------------------
         * Système
         * --------------------------------------------------------
         */

        {
            id: "settings",
            section: "SYSTEM",
            title: "Paramètres",
            description:
                "Configuration générale de l'application",
            route:
                "/administration/settings",
            enabled: false,
        },

        {
            id: "maintenance",
            section: "SYSTEM",
            title: "Maintenance",
            description:
                "Mode maintenance de l'application",
            route:
                "/administration/maintenance",
            enabled: false,
        },

        {
            id: "audit",
            section: "SYSTEM",
            title: "Journal d'audit",
            description:
                "Historique des actions administratives",
            route:
                "/administration/audit",
            enabled: false,
        },

    ];