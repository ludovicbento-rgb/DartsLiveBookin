export const MATCHES_ROUTE =
    "/matches";

export function planningRoute(
    matchId: string,
) {

    return `/planning?matchId=${matchId}`;

}