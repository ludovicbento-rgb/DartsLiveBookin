import {
    doc,
    getDoc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

import type {
    SeasonImportFile,
    SeasonImportCollision,
    SeasonImportCollisionResult,
} from "../model/season-import.types";

interface DocumentToCheck {

    collection:
    SeasonImportCollision["collection"];

    id: string;

}

export async function checkSeasonImportCollisions(
    data: SeasonImportFile,
): Promise<SeasonImportCollisionResult> {

    const documents:
        DocumentToCheck[] = [

            {
                collection:
                    "seasons",

                id:
                    data.season.id,
            },

            ...data.competitions.map(
                competition => ({
                    collection:
                        "competitions" as const,

                    id:
                        competition.id,
                }),
            ),

            ...data.pools.map(
                pool => ({
                    collection:
                        "pools" as const,

                    id:
                        pool.id,
                }),
            ),

            ...data.registrations.map(
                registration => ({
                    collection:
                        "registrations" as const,

                    id:
                        registration.id,
                }),
            ),

            ...data.matchDays.map(
                matchDay => ({
                    collection:
                        "matchdays" as const,

                    id:
                        matchDay.id,
                }),
            ),

            ...data.matches.map(
                match => ({
                    collection:
                        "matches" as const,

                    id:
                        match.id,
                }),
            ),

        ];

    const results =
        await Promise.all(

            documents.map(
                async item => {

                    const snapshot =
                        await getDoc(
                            doc(
                                db,
                                item.collection,
                                item.id,
                            ),
                        );

                    return {

                        ...item,

                        exists:
                            snapshot.exists(),

                    };

                },
            ),

        );

    const collisions:
        SeasonImportCollision[] =
        results
            .filter(
                result =>
                    result.exists,
            )
            .map(
                result => ({
                    collection:
                        result.collection,

                    id:
                        result.id,
                }),
            );

    return {

        hasCollisions:
            collisions.length > 0,

        collisions,

    };

}