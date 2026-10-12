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
    SeasonImportIssue,
} from "../model/season-import.types";

import type {
    SeasonImportV2File,
} from "../model/season-import-v2.types";

export async function validateImportV2References(
    data: SeasonImportV2File,
): Promise<SeasonImportIssue[]> {

    const issues:
        SeasonImportIssue[] = [];

    /*
     * Pour MATCHES, les inscriptions existent déjà.
     * Leur cohérence est contrôlée par
     * analyzeSeasonImportV2().
     */
    if (
        data.scope !== "POOL"
    ) {

        return issues;

    }

    const userIds =
        new Set<string>();

    const venueIds =
        new Set<string>();

    /*
     * ============================================================
     * COLLECTE
     * ============================================================
     */

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

    const users =
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
        const user
        of users
    ) {

        if (
            !user.snapshot.exists()
        ) {

            issues.push({

                severity:
                    "ERROR",

                code:
                    "IMPORT_V2_USER_NOT_FOUND",

                message:
                    `L'utilisateur ${user.userId} n'existe pas.`,

                path:
                    `users/${user.userId}`,

            });

        }

    }

    /*
     * ============================================================
     * VENUES
     * ============================================================
     */

    const venues =
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
        const venue
        of venues
    ) {

        if (
            !venue.snapshot.exists()
        ) {

            issues.push({

                severity:
                    "ERROR",

                code:
                    "IMPORT_V2_VENUE_NOT_FOUND",

                message:
                    `L'établissement ${venue.venueId} n'existe pas.`,

                path:
                    `venues/${venue.venueId}`,

            });

        }

    }

    return issues;

}   