import type {
    BookingSuggestion,
} from "../booking-engine";

export interface BookingValidationResult {

    available: boolean;

    alternatives: BookingSuggestion[];

}