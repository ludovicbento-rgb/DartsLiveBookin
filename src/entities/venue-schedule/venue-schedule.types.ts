export interface VenueSchedule {

    id: string;

    venueId: string;

    dayOfWeek: number;

    openTime: string;

    closeTime: string;

    boardNumbers: number[];

    active: boolean;

}   