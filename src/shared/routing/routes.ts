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

export const AGENDA_ROUTE =
    "/agenda";

export const ADMINISTRATION_ROUTE =
    "/administration";

/*
 * Administration
 */

export const ADMIN_ROUTE =
    "/administration";

export const ADMIN_SEASONS_ROUTE =
    "/administration/seasons";

export const ADMIN_VENUES_ROUTE =
    "/administration/venues";

export const ADMIN_USERS_ROUTE =
    "/administration/users";

export const ADMIN_COMPETITIONS_ROUTE =
    "/administration/competitions";

export const ADMIN_POOLS_ROUTE =
    "/administration/pools";

export const ADMIN_REGISTRATIONS_ROUTE =
    "/administration/registrations";

export const ADMIN_MATCH_DAYS_ROUTE =
    "/administration/match-days";

export const ADMIN_MATCHES_ROUTE =
    "/administration/matches";

export const ADMIN_IMPORT_ROUTE =
    "/administration/import";

export const ADMIN_EXPORT_ROUTE =
    "/administration/export";

export const RESERVATION_VALIDATION_ROUTE =
    "/reservation-validation";

export const ADMIN_SETTINGS_ROUTE =
    "/administration/settings";

export const VENUE_SETTINGS_ROUTE =
    "/venue-settings";

export function venueSettingsRoute() {

    return VENUE_SETTINGS_ROUTE;

}

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