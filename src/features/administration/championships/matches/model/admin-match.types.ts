import type {
    MatchPlayStatus,
} from "@/entities/match";

export interface AdminMatchRequest {

    matchDayId: string;

    homeRegistrationId: string;

    awayRegistrationId: string;

    /*
     * Etat sportif uniquement.
     *
     * TO_PLAY = non joué
     * PLAYED  = joué
     */
    playStatus:
    MatchPlayStatus;

}