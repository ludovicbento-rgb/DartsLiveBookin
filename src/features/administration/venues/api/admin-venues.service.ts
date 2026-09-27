import {
    createVenue,
    getVenues,
    updateVenue,
} from "@/entities/venue";

import type {
    Venue,
} from "@/entities/venue";

import type {
    AdminVenueRequest,
} from "../model/admin-venue.types";

function validateVenue(
    request: AdminVenueRequest,
): void {

    if (
        request.name.trim() === ""
    ) {

        throw new Error(
            "VENUE_NAME_REQUIRED",
        );

    }

    if (
        request.city.trim() === ""
    ) {

        throw new Error(
            "VENUE_CITY_REQUIRED",
        );

    }

    if (
        !Number.isInteger(
            request.boardCount,
        )
        ||
        request.boardCount < 1
    ) {

        throw new Error(
            "VENUE_BOARD_COUNT_INVALID",
        );

    }

}

function normalizeVenue(
    request: AdminVenueRequest,
): AdminVenueRequest {

    return {

        name:
            request.name.trim(),

        city:
            request.city.trim(),

        address:
            request.address.trim(),

        boardCount:
            request.boardCount,

        logo:
            request.logo?.trim()
            || null,

        active:
            request.active,

        managerUserIds:
            Array.from(
                new Set(
                    request.managerUserIds,
                ),
            ),

    };

}

export async function loadAdminVenues():
    Promise<Venue[]> {

    const venues =
        await getVenues();

    return [...venues].sort(
        (a, b) =>
            a.name.localeCompare(
                b.name,
                "fr",
            ),
    );

}

export async function createAdminVenue(
    request: AdminVenueRequest,
): Promise<string> {

    validateVenue(
        request,
    );

    return createVenue(
        normalizeVenue(
            request,
        ),
    );

}

export async function updateAdminVenue(

    venueId: string,

    request: AdminVenueRequest,

): Promise<void> {

    validateVenue(
        request,
    );

    await updateVenue(

        venueId,

        normalizeVenue(
            request,
        ),

    );

}