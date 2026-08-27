export type CompetitionType =
    | "DOUBLES"
    | "INDIVIDUAL"
    | "TEAM";

export interface Registration {

    id: string;

    seasonId: string;

    competitionId: string;

    poolId: string;

    registrationName: string;

    captainId: string;

    playerIds: string[];

    /**
     * Etablissement où cette inscription reçoit
     * ses matchs à domicile.
     */
    homeVenueId: string;

    active: boolean;

}