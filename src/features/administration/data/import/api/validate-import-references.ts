import {
    getDoc,
} from "firebase/firestore";

import {
    userDocument,
} from "@/entities/user";

import {
    venueDocument,
} from "@/entities/venue";

import type {
    SeasonImportFile,
    SeasonImportIssue,
} from "../model/season-import.types";

export async function validateImportReferences(
    data: SeasonImportFile,
): Promise<SeasonImportIssue[]> {

    const issues:
        SeasonImportIssue[] = [];

    /*
     * ============================================================
     * Collecte des IDs uniques
     * ============================================================
     */

    const userIds =
        new Set<string>();

    const venueIds =
        new Set<string>();

    for (
        const registration
        of data.registrations
    ) {

        userIds.add(
            registration.captainId,
        );

        for (
            const playerId
            of registration.playerIds
        ) {

            userIds.add(
                playerId,
            );

        }

        venueIds.add(
            registration.homeVenueId,
        );

    }

    /*
     * ============================================================
     * USERS
     * ============================================================
     */

    const userResults =
        await Promise.all(

            [...userIds].map(
                async userId => ({

                    userId,

                    snapshot:
                        await getDoc(
                            userDocument(
                                userId,
                            ),
                        ),

                }),
            ),

        );

    for (
        const result
        of userResults
    ) {

        if (
            !result.snapshot.exists()
        ) {

            issues.push({

                severity:
                    "ERROR",

                code:
                    "USER_NOT_FOUND",

                message:
                    `L'utilisateur ${result.userId} n'existe pas.`,

                path:
                    `users/${result.userId}`,

            });

        }

    }

    /*
     * ============================================================
     * VENUES
     * ============================================================
     */

    const venueResults =
        await Promise.all(

            [...venueIds].map(
                async venueId => ({

                    venueId,

                    snapshot:
                        await getDoc(
                            venueDocument(
                                venueId,
                            ),
                        ),

                }),
            ),

        );

    for (
        const result
        of venueResults
    ) {

        if (
            !result.snapshot.exists()
        ) {

            issues.push({

                severity:
                    "ERROR",

                code:
                    "VENUE_NOT_FOUND",

                message:
                    `L'établissement ${result.venueId} n'existe pas.`,

                path:
                    `venues/${result.venueId}`,

            });

        }

    }

    return issues;

}