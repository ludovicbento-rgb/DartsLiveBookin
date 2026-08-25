export interface UserProfile {
    firebaseUid: string;

    licenseNumber: string;

    firstname: string;

    lastname: string;

    email: string;

    seasonId: string;

    accountActivated: boolean;

    roles: {
        administrator: boolean;
        manager: boolean;
        player: boolean;
    };

    createdAt: unknown;

    updatedAt: unknown;

    lastLoginAt?: unknown;

    status?: "ACTIVE" | "BLOCKED";
}