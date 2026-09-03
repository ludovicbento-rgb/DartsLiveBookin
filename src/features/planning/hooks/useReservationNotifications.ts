import {
    useState,
} from "react";

import type {
    NotificationState,
    NotificationSeverity,
} from "@/shared/notifications/notification";

export function useReservationNotifications() {

    const [

        notification,

        setNotification,

    ] = useState<NotificationState>({

        open: false,

        severity: "success",

        message: "",

    });

    function show(

        severity: NotificationSeverity,

        message: string,

    ) {

        setNotification({

            open: true,

            severity,

            message,

        });

    }

    function hide() {

        setNotification(

            previous => ({

                ...previous,

                open: false,

            }),

        );

    }

    function success(

        message: string,

    ) {

        show(

            "success",

            message,

        );

    }

    function error(

        message: string,

    ) {

        show(

            "error",

            message,

        );

    }

    function warning(

        message: string,

    ) {

        show(

            "warning",

            message,

        );

    }

    function info(

        message: string,

    ) {

        show(

            "info",

            message,

        );

    }

    return {

        notification,

        success,

        warning,

        info,

        error,

        hide,

    };

}   