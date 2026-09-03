export type NotificationSeverity =

    "success"

    | "info"

    | "warning"

    | "error";

export interface NotificationState {

    open: boolean;

    severity: NotificationSeverity;

    message: string;

}