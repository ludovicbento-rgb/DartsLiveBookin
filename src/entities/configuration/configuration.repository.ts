import {
    getDoc,
} from "firebase/firestore";

import {
    configurationDocument,
} from "./configuration.firestore";

import {
    mapConfiguration,
} from "./configuration.mapper";

export async function getConfiguration() {

    const snapshot =
        await getDoc(
            configurationDocument,
        );

    if (!snapshot.exists()) {

        throw new Error(
            "CONFIGURATION_NOT_FOUND",
        );

    }

    return mapConfiguration(
        snapshot,
    );

}