/**
 * Routes statiques
 */

export const HOME_ROUTE =
    "/";

export const LOGIN_ROUTE =
    "/login";

export const DASHBOARD_ROUTE =
    "/dashboard";

export const MY_MATCHES_ROUTE =
    "/matches";

export const MAINTENANCE_ROUTE =
    "/maintenance";

export const ACTIVATE_ACCOUNT_ROUTE =
    "/activate";

/**
 * Planning d'un établissement.
 */
export function planningRoute(
    venueId: string,
): string {

    return `/planning/${encodeURIComponent(
        venueId,
    )}`;

}

/**
 * Planning d'un établissement pour un match.
 */
export function planningMatchRoute(
    venueId: string,
    matchId: string,
): string {

    return `/planning/${encodeURIComponent(
        venueId,
    )}?matchId=${encodeURIComponent(
        matchId,
    )}`;

}