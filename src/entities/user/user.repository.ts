import {
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

import {
    userDocument,
    usersCollection,
} from "./user.firestore";

import {
    userAuthDocument,
} from "./user-auth.firestore";

import {
    activationLicenseDocument,
} from "./activation-license.firestore";

import type { UserProfile } from "./user.types";

export interface CreateUserRequest {

    licenseNumber: string;

    firstname: string;

    lastname: string;

    email: string;

    seasonId: string;

    roles: {
        administrator: boolean;
        manager: boolean;
        player: boolean;
    };

}

export async function createUser(

    request: CreateUserRequest,

): Promise<string> {

    /*
     * ------------------------------------------------------------
     * Vérification de la licence
     * ------------------------------------------------------------
     */

    const existingLicense =
        await getDoc(

            activationLicenseDocument(
                request.licenseNumber,
            ),

        );

    if (
        existingLicense.exists()
    ) {

        throw new Error(
            "LICENSE_ALREADY_EXISTS",
        );

    }

    /*
     * ------------------------------------------------------------
     * Nouvel ID métier
     * ------------------------------------------------------------
     */

    const userRef =
        doc(
            usersCollection,
        );

    const batch =
        writeBatch(
            db,
        );

    /*
     * ------------------------------------------------------------
     * Profil utilisateur
     * ------------------------------------------------------------
     */

    batch.set(

        userRef,

        {

            firebaseUid:
                null,

            licenseNumber:
                request.licenseNumber,

            firstname:
                request.firstname.trim(),

            lastname:
                request.lastname.trim(),

            email:
                request.email.trim(),

            seasonId:
                request.seasonId,

            accountActivated:
                false,

            roles:
                request.roles,

            status:
                "ACTIVE",

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp(),

            lastLoginAt:
                null,

        },

    );

    /*
     * ------------------------------------------------------------
     * Index d'activation
     *
     * activation-licenses/<licenseNumber>
     * {
     *     userId: "..."
     * }
     * ------------------------------------------------------------
     */

    batch.set(

        activationLicenseDocument(
            request.licenseNumber,
        ),

        {

            userId:
                userRef.id,

        },

    );

    /*
     * ------------------------------------------------------------
     * Commit atomique
     * ------------------------------------------------------------
     */

    await batch.commit();

    return userRef.id;

}

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

export async function getUserByAuthUid(
    firebaseUid: string,
): Promise<UserProfile | null> {

    const authSnapshot =
        await getDoc(
            userAuthDocument(
                firebaseUid,
            ),
        );

    if (!authSnapshot.exists()) {

        return null;

    }

    const data =
        authSnapshot.data() as {
            userId?: string;
        };

    if (!data.userId) {

        return null;

    }

    return getUser(
        data.userId,
    );

}

export async function getUsers():
    Promise<UserProfile[]> {

    const snapshot =
        await getDocs(
            usersCollection,
        );

    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...(document.data() as Omit<
                UserProfile,
                "id"
            >),

        }),
    );

}

export async function getUserByActivationLicense(
    licenseNumber: string,
): Promise<UserProfile | null> {

    const activationSnapshot =
        await getDoc(
            activationLicenseDocument(
                licenseNumber,
            ),
        );

    if (!activationSnapshot.exists()) {

        return null;

    }

    const data =
        activationSnapshot.data() as {
            userId?: string;
        };

    if (!data.userId) {

        return null;

    }

    return getUser(
        data.userId,
    );

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

    const batch =
        writeBatch(
            db,
        );

    /*
     * Activation du profil métier.
     */
    batch.update(

        userDocument(
            userId,
        ),

        {
            firebaseUid,

            email,

            accountActivated:
                true,

            lastLoginAt:
                new Date(),

            updatedAt:
                new Date(),
        },

    );

    /*
     * Index permettant aux Security Rules
     * de retrouver users/<userId>
     * depuis request.auth.uid.
     */
    batch.set(

        userAuthDocument(
            firebaseUid,
        ),

        {
            userId,
        },

    );

    /*
     * Les deux écritures sont atomiques.
     */
    await batch.commit();

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