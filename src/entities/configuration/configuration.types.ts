export interface ReservationSlot {

    startTime: string;

    endTime: string;

}

export interface Configuration {

    applicationName: string;

    currentSeasonId: string;

    reservationDuration: number;

    reservationSlots: ReservationSlot[];

    maintenanceMode: boolean;

    version: string;

}