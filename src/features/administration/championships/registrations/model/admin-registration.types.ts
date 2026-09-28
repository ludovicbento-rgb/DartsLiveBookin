export interface AdminRegistrationRequest {

    seasonId: string;

    competitionId: string;

    poolId: string;

    registrationName: string;

    captainId: string;

    playerIds: string[];

    homeVenueId: string;

    active: boolean;

}