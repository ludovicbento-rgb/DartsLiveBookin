import {
    createUser,
    getUsers,
    updateUser,
} from "@/entities/user";

import {
    Timestamp,
} from "firebase/firestore";

import type {
    UserProfile,
} from "@/entities/user";

import type {
    AdminUserListItem,
    CreateAdminUserRequest,
    UpdateAdminUserRequest,
} from "../model/admin-user.types";

function mapUser(
    user: UserProfile,
): AdminUserListItem {

    return {

        id:
            user.id,

        licenseNumber:
            user.licenseNumber,

        firstname:
            user.firstname,

        lastname:
            user.lastname,

        email:
            user.email,

        seasonId:
            user.seasonId,

        accountActivated:
            user.accountActivated,

        status:
            user.status,

        roles:
            user.roles,

        firebaseUid:
            user.firebaseUid,

    };

}

export async function loadAdminUsers():
    Promise<AdminUserListItem[]> {

    const users =
        await getUsers();

    return users

        .map(
            mapUser,
        )

        .sort(
            (a, b) => {

                const lastname =
                    a.lastname.localeCompare(
                        b.lastname,
                        "fr",
                    );

                if (
                    lastname !== 0
                ) {

                    return lastname;

                }

                return a.firstname.localeCompare(
                    b.firstname,
                    "fr",
                );

            },
        );

}

export async function createAdminUser(

    request: CreateAdminUserRequest,

): Promise<string> {

    if (
        request.licenseNumber.trim() === ""
    ) {

        throw new Error(
            "LICENSE_REQUIRED",
        );

    }

    if (
        request.firstname.trim() === ""
        ||
        request.lastname.trim() === ""
    ) {

        throw new Error(
            "NAME_REQUIRED",
        );

    }

    if (
        !request.roles.player
        &&
        !request.roles.manager
        &&
        !request.roles.administrator
    ) {

        throw new Error(
            "ROLE_REQUIRED",
        );

    }

    return createUser({

        licenseNumber:
            request.licenseNumber.trim(),

        firstname:
            request.firstname.trim(),

        lastname:
            request.lastname.trim(),

        email:
            request.email.trim(),

        seasonId:
            request.seasonId,

        roles:
            request.roles,

    });

}

export async function updateAdminUser(

    userId: string,

    request: UpdateAdminUserRequest,

): Promise<void> {

    if (
        !request.roles.player
        &&
        !request.roles.manager
        &&
        !request.roles.administrator
    ) {

        throw new Error(
            "ROLE_REQUIRED",
        );

    }

    await updateUser(

        userId,

        {

            firstname:
                request.firstname.trim(),

            lastname:
                request.lastname.trim(),

            email:
                request.email.trim(),

            roles:
                request.roles,

            updatedAt:
                Timestamp.now(),

        },

    );

}

export async function setAdminUserStatus(

    userId: string,

    status:
        | "ACTIVE"
        | "BLOCKED",

): Promise<void> {

    await updateUser(

        userId,

        {

            status,

            updatedAt:
                new Date() as never,

        },

    );

}