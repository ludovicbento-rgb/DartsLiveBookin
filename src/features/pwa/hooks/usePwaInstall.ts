import {
    useEffect,
    useState,
} from "react";

interface BeforeInstallPromptEvent
    extends Event {

    prompt():
        Promise<void>;

    userChoice:
    Promise<{
        outcome:
        | "accepted"
        | "dismissed";
        platform:
        string;
    }>;

}

export type PwaPlatform =
    | "IOS"
    | "ANDROID"
    | "DESKTOP"
    | "UNKNOWN";

function detectPlatform():
    PwaPlatform {

    const userAgent =
        navigator.userAgent;

    const isIOS =
        /iPad|iPhone|iPod/i.test(
            userAgent,
        )
        ||
        (
            navigator.platform ===
            "MacIntel"
            &&
            navigator.maxTouchPoints >
            1
        );

    if (isIOS) {

        return "IOS";

    }

    if (
        /Android/i.test(
            userAgent,
        )
    ) {

        return "ANDROID";

    }

    if (
        /Windows|Macintosh|Linux/i.test(
            userAgent,
        )
    ) {

        return "DESKTOP";

    }

    return "UNKNOWN";

}

function detectStandalone():
    boolean {

    const standalone =
        window.matchMedia(
            "(display-mode: standalone)",
        ).matches;

    const navigatorStandalone =
        (
            navigator as Navigator & {
                standalone?:
                boolean;
            }
        ).standalone ===
        true;

    return (
        standalone
        ||
        navigatorStandalone
    );

}

export function usePwaInstall() {

    const [
        platform,
        setPlatform,
    ] =
        useState<PwaPlatform>(
            "UNKNOWN",
        );

    const [
        installed,
        setInstalled,
    ] =
        useState(false);

    const [
        installPrompt,
        setInstallPrompt,
    ] =
        useState<
            BeforeInstallPromptEvent
            | null
        >(
            null,
        );

    useEffect(() => {

        setPlatform(
            detectPlatform(),
        );

        setInstalled(
            detectStandalone(),
        );

        function handleBeforeInstallPrompt(
            event: Event,
        ) {

            event.preventDefault();

            setInstallPrompt(
                event as
                BeforeInstallPromptEvent,
            );

        }

        function handleInstalled() {

            setInstalled(
                true,
            );

            setInstallPrompt(
                null,
            );

        }

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt,
        );

        window.addEventListener(
            "appinstalled",
            handleInstalled,
        );

        return () => {

            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt,
            );

            window.removeEventListener(
                "appinstalled",
                handleInstalled,
            );

        };

    }, []);

    async function install():
        Promise<boolean> {

        if (!installPrompt) {

            return false;

        }

        await installPrompt.prompt();

        const choice =
            await installPrompt.userChoice;

        if (
            choice.outcome ===
            "accepted"
        ) {

            setInstallPrompt(
                null,
            );

            return true;

        }

        return false;

    }

    return {

        platform,

        installed,

        canInstall:
            installPrompt !==
            null,

        install,

    };

}