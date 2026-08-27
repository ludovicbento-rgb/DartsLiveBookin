export type BoardStatus =
    | "AVAILABLE"
    | "PENDING"
    | "CONFIRMED";

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

}