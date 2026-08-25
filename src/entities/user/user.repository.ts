import {
    getDoc,
    updateDoc,
} from "firebase/firestore";

import {
    userDocument,
} from "./user.firestore";

import type { UserProfile } from "./user.types";

export async function getUserByUid(
    uid: string,
): Promise<UserProfile | null> {
    const snapshot =
        await getDoc(userDocument(uid));

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data() as UserProfile;
}

export async function updateUser(
    uid: string,
    values: Partial<UserProfile>,
) {
    await updateDoc(
        userDocument(uid),
        values,
    );
}