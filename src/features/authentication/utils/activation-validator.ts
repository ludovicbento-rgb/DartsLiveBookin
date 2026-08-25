import type { UserProfile } from "@/entities/user";

export function validateActivation(
    user: UserProfile | null,
): void {

    if (!user) {
        throw new Error("LICENSE_NOT_FOUND");
    }

    if (user.accountActivated) {
        throw new Error("ACCOUNT_ALREADY_ACTIVATED");
    }

    if (user.status !== "ACTIVE") {
        throw new Error("ACCOUNT_BLOCKED");
    }

}