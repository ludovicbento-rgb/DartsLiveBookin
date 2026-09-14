import {
    buildPlanning,
    type OpeningHours,
    type PlanningBoard,
    type Reservation,
} from "@/core/reservation-engine";

import type {
    AvailabilityClosure,
} from "./model/availability-closure";

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

function findMatchingRule(

    input: AvailabilityInput,

): AvailabilityRule | null {

    return (

        input.rules.find(rule => {

            if (!rule.isActive) {

                return false;

            }

            const reservationDate =
                input.reservationDate;

            if (

                reservationDate < rule.validFrom.toDate()

                ||

                reservationDate > rule.validTo.toDate()

            ) {

                return false;

            }

            switch (rule.frequency) {

                case "DAILY":

                    return true;

                case "WEEKLY":

                    return rule.weekDays.includes(

                        reservationDate.getDay(),

                    );

                default:

                    return false;

            }

        })

        ??

        null

    );

}

function applyAvailabilityRules(

    planning: PlanningBoard[],

    rule: AvailabilityRule,

): void {

    for (const board of planning) {

        for (const slot of board.slots) {

            if (

                slot.startTime >= rule.startTime

                &&

                slot.endTime <= rule.endTime

            ) {

                slot.status = "BLOCKED";

                slot.blockType = rule.type;

                slot.blockTitle = rule.title;

                slot.blockDescription =
                    rule.description;

            }

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

    const rule =

        findMatchingRule(

            input,

        );

    const planning =

        buildPlanning(

            input.openingHours,

            input.durationMinutes,

            input.reservations,

        );

    if (rule) {

        applyAvailabilityRules(

            planning,

            rule,

        );

    }

    return {

        available: true,

        planning,

        reason:

            rule

                ? "RULE"

                : "OPEN",

        closure: null,

        rule,

    };

}