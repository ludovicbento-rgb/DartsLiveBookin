import type {
    AvailabilityDecision,
} from "@/core/availability-engine";

import type {
    AvailabilityRuleType,
} from "@/entities/availability-rule";

export type BoardStatus =

    | "AVAILABLE"

    | "PENDING"

    | "CONFIRMED"

    | "BLOCKED";

export interface BoardSlot {

    /**
     * Numéro de la cible.
     */
    boardNumber: number;

    /**
     * Etat de la cible.
     */
    status: BoardStatus;

    /**
     * Réservation associée.
     */
    reservationId?: string;

    matchId?: string;

    label?: string;

    blockType?: AvailabilityRuleType;


}

export interface TimeSlot {

    /**
     * Heure de début.
     */
    startTime: string;

    /**
     * Heure de fin.
     */
    endTime: string;

    /**
     * Ensemble des cibles du créneau.
     */
    boards: BoardSlot[];

}

export interface VenuePlanning {

    /**
     * Etablissement.
     */
    venueId: string;

    /**
     * Nom de l'établissement.
     */
    venueName: string;

    /**
     * Nombre total de cibles.
     */
    boardCount: number;

    /**
     * Planning de la journée.
     */
    slots: TimeSlot[];

    availability: VenueAvailability;

}

export interface VenueAvailability {

    decision: AvailabilityDecision;

}