export interface VenueSchedule {

    id: string;

    venueId: string;

    dayOfWeek: number;

    startTime: string;

    endTime: string;

    boardNumbers: number[];

    active: boolean;

}   