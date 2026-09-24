import {
    buildPlanning,
    type OpeningHours,
    type PlanningBoard,
    type Reservation,
} from "@/core/reservation-engine";

import type {
    AvailabilityClosure,
} from "./model/availability-closure";

import {
    toMinutes,
} from "@/core/reservation-engine";

import type {
    AvailabilityRule,
} from "../../entities/availability-rule/availability-rule.types";

import {
    isDateBetween,
} from "../common/date";

export type AvailabilityReason =

    | "OPEN"

    | "RULE"

    | "CLOSURE";

export interface AvailabilityDecision {

    available: boolean;

    planning: PlanningBoard[];

    reason: AvailabilityReason;

    rule: AvailabilityRule | null;

    closure: AvailabilityClosure | null;

}

export interface AvailabilityInput {

    openingHours: OpeningHours;

    durationMinutes: number;

    reservations: Reservation[];

    closures: AvailabilityClosure[];

    rules: AvailabilityRule[];

    reservationDate: Date;

}

function overlaps(

    slotStart: string,

    slotEnd: string,

    ruleStart: string,

    ruleEnd: string,

): boolean {

    const slotStartMinutes =
        toMinutes(slotStart);

    let slotEndMinutes =
        toMinutes(slotEnd);

    const ruleStartMinutes =
        toMinutes(ruleStart);

    let ruleEndMinutes =
        toMinutes(ruleEnd);

    // Gestion des plages après minuit
    if (slotEndMinutes <= slotStartMinutes) {

        slotEndMinutes += 24 * 60;

    }

    if (ruleEndMinutes <= ruleStartMinutes) {

        ruleEndMinutes += 24 * 60;

    }

    return (

        slotStartMinutes < ruleEndMinutes

        &&

        slotEndMinutes > ruleStartMinutes

    );

}

function findMatchingClosure(

    input: AvailabilityInput,

): AvailabilityClosure | null {

    return (

        input.closures.find(

            closure =>

                closure.active &&

                isDateBetween(

                    input.reservationDate,

                    closure.startDate,

                    closure.endDate,

                ),

        )

        ??

        null

    );

}
function toLocalDateKey(
    date: Date,
): string {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1,
        ).padStart(2, "0");

    const day =
        String(
            date.getDate(),
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}
function findMatchingRules(

    input: AvailabilityInput,

): AvailabilityRule[] {

    return input.rules.filter(rule => {

        if (!rule.isActive) {

            return false;

        }

        const reservationDate =
            input.reservationDate;

        const reservationDateKey =
            toLocalDateKey(
                reservationDate,
            );

        if (
            reservationDateKey < rule.validFrom
            ||
            reservationDateKey > rule.validTo
        ) {

            return false;

        }

        switch (

        rule.frequency

        ) {

            case "DAILY":

                return true;

            case "WEEKLY":

                return rule.weekDays.includes(

                    reservationDate.getDay(),

                );

            default:

                return false;

        }

    });

}

function applyAvailabilityRule(

    planning: PlanningBoard[],

    rule: AvailabilityRule,

): void {

    for (const board of planning) {

        for (const slot of board.slots) {

            if (

                !overlaps(

                    slot.startTime,

                    slot.endTime,

                    rule.startTime,

                    rule.endTime,

                )

            ) {

                continue;

            }

            // Une réservation reste prioritaire
            if (

                slot.status !== "AVAILABLE"

            ) {

                continue;

            }

            slot.status = "BLOCKED";

            slot.blockType = rule.type;

            slot.blockTitle = rule.title;

            slot.blockDescription = rule.description;

        }

    }

}

export function buildAvailability(

    input: AvailabilityInput,

): AvailabilityDecision {

    const closure =

        findMatchingClosure(

            input,

        );

    if (closure) {

        return {

            available: false,

            planning: [],

            reason: "CLOSURE",

            closure,

            rule: null,

        };

    }

    const planning =

        buildPlanning(

            input.openingHours,

            input.durationMinutes,

            input.reservations,

        );


    const matchingRules =

        findMatchingRules(
            input,
        );

    for (

        const rule of matchingRules

    ) {

        applyAvailabilityRule(

            planning,

            rule,

        );

    }

    return {

        available: true,

        planning,

        reason:

            matchingRules.length > 0

                ? "RULE"

                : "OPEN",

        closure: null,

        rule:

            matchingRules.length > 0

                ? matchingRules[0]

                : null,

    };

}