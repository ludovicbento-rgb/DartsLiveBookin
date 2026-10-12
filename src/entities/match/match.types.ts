import type {
    Timestamp,
} from "firebase/firestore";

/*
 * ============================================================
 * STATUT DE PLANIFICATION
 * ============================================================
 *
 * Ce statut concerne uniquement le workflow de réservation.
 */

export type MatchStatus =
    | "NOT_PLANNED"
    | "PENDING"
    | "PLANNED";

/*
 * ============================================================
 * STATUT SPORTIF
 * ============================================================
 *
 * TO_PLAY :
 * rencontre encore à jouer.
 *
 * PLAYED :
 * rencontre déjà jouée.
 *
 * Le résultat sportif reste géré par l'autre application.
 */

export type MatchPlayStatus =
    | "TO_PLAY"
    | "PLAYED";

export interface Match {

    id: string;

    matchDayId: string;

    homeRegistrationId: string;

    awayRegistrationId: string;

    /*
     * Workflow de réservation.
     */
    status: MatchStatus;

    plannedReservationId:
    string | null;

    /*
     * Workflow sportif.
     *
     * Optionnel temporairement pour assurer
     * la compatibilité avec les anciens documents.
     */
    playStatus?:
    MatchPlayStatus;

    createdAt?: Timestamp;

    updatedAt?: Timestamp;

}