import {
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

import {
    userDocument,
    usersCollection,
} from "./user.firestore";

import type { UserProfile } from "./user.types";

/**
 * Lecture par Document Firestore ID
 */
export async function getUser(
    userId: string,
): Promise<UserProfile | null> {

    const snapshot =
        await getDoc(userDocument(userId));

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...(snapshot.data() as Omit<UserProfile, "id">),
    };
}

/**
 * Recherche par numéro de licence
 */
export async function getUserByLicenseNumber(
    licenseNumber: string,
): Promise<UserProfile | null> {

    const q = query(
        usersCollection,
        where(
            "licenseNumber",
            "==",
            licenseNumber,
        ),
    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    const document =
        snapshot.docs[0];

    return {
        id: document.id,
        ...(document.data() as Omit<UserProfile, "id">),
    };
}

/**
 * Recherche par Firebase UID
 */
export async function getUserByFirebaseUid(
    firebaseUid: string,
): Promise<UserProfile | null> {

    const q = query(
        usersCollection,
        where(
            "firebaseUid",
            "==",
            firebaseUid,
        ),
    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    const document =
        snapshot.docs[0];

    return {
        id: document.id,
        ...(document.data() as Omit<UserProfile, "id">),
    };
}

/**
 * Activation du compte
 */
export async function activateUser(
    userId: string,
    firebaseUid: string,
    email: string,
): Promise<void> {

    await updateDoc(

        userDocument(userId),

        {

            firebaseUid,

            email,

            accountActivated: true,

            lastLoginAt: new Date(),

            updatedAt: new Date(),

        },

    );

}

/**
 * Mise à jour générique
 */
export async function updateUser(
    userId: string,
    values: Partial<UserProfile>,
): Promise<void> {

    await updateDoc(
        userDocument(userId),
        values,
    );

}   