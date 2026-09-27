import type {
    UserRoles,
} from "@/entities/user";

export interface CreateAdminUserRequest {

    licenseNumber: string;

    firstname: string;

    lastname: string;

    email: string;

    seasonId: string;

    roles: UserRoles;

}

export interface UpdateAdminUserRequest {

    firstname: string;

    lastname: string;

    email: string;

    roles: UserRoles;

}

export interface AdminUserListItem {

    id: string;

    licenseNumber: string;

    firstname: string;

    lastname: string;

    email: string;

    seasonId: string;

    accountActivated: boolean;

    status:
    | "ACTIVE"
    | "BLOCKED";

    roles: UserRoles;

    firebaseUid:
    string | null;

}