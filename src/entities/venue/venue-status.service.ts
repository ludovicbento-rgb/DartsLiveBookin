import type {
    VenueStatus,
} from "./venue-status";

interface Input {

    isOpen: boolean;

    hasEvent: boolean;

    hasMaintenance: boolean;

    availableBoards: number;

}

export function buildVenueStatus({

    isOpen,

    hasEvent,

    hasMaintenance,

    availableBoards,

}: Input): VenueStatus {

    if (!isOpen) {

        return {

            type: "CLOSED",

            title: "Fermé",

            message:
                "L'établissement est fermé.",

        };

    }

    if (hasMaintenance) {

        return {

            type: "MAINTENANCE",

            title: "Maintenance",

            message:
                "Les cibles sont indisponibles.",

        };

    }

    if (hasEvent) {

        return {

            type: "EVENT",

            title: "Évènement",

            message:
                "Réservation impossible aujourd'hui.",

        };

    }

    if (availableBoards === 0) {

        return {

            type: "FULL",

            title: "Complet",

            message:
                "Tous les créneaux sont réservés.",

        };

    }

    return {

        type: "OPEN",

        title: "Ouvert",

        message:
            "L'établissement est ouvert.",

    };

}