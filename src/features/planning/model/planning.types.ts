export interface BoardSlot {
    boardNumber: number;
    available: boolean;
}

export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    boards: BoardSlot[];
}

export interface VenuePlanning {
    venueId: string;
    venueName: string;
    slots: TimeSlot[];
}