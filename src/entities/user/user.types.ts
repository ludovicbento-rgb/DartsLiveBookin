import type { Timestamp } from "firebase/firestore";

export interface UserRoles {
    administrator: boolean;
    manager: boolean;
    player: boolean;
}

export interface UserProfile {

    /**
     * Identifiant du document Firestore.
     */
    id: string;

    playerId: string;

    /**
     * UID Firebase Authentication.
     * Null tant que le compte n'est pas activé.
     */
    firebaseUid: string | null;

    /**
     * Numéro de licence Dartslive.         
     */
    licenseNumber: string;

    firstname: string;

    lastname: string;

    email: string;

    seasonId: string;

    /**
     * Compte activé ?
     */
    accountActivated: boolean;

    /**
     * Rôles de l'utilisateur.
     */
    roles: UserRoles;

    status: "ACTIVE" | "BLOCKED";

    createdAt: Timestamp;

    updatedAt: Timestamp;

    lastLoginAt: Timestamp | null;

}