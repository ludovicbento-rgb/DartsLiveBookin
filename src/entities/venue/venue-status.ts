export type VenueStatusType =

    | "OPEN"

    | "CLOSED"

    | "EVENT"

    | "MAINTENANCE"

    | "FULL";

export interface VenueStatus {

    type: VenueStatusType;

    title: string;

    message: string;

}