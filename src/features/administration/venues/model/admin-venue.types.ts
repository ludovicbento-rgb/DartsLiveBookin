export interface AdminVenueRequest {

    name: string;

    city: string;

    address: string;

    boardCount: number;

    logo: string | null;

    active: boolean;

    managerUserIds: string[];

}