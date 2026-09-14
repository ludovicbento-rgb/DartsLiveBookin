import {
    getDocs,
    query,
    where,
} from "firebase/firestore";

import {
    addDoc,
    Timestamp,
    serverTimestamp,
} from "firebase/firestore";

import {
    availabilityRulesCollection,
} from "./availability-rule.firestore";

import {
    mapAvailabilityRule,
} from "./availability-rule.mapper";

import type {
    AvailabilityRule,
} from "./availability-rule.types";

import type {
    AvailabilityFrequency,
    AvailabilityRuleType,
} from "./availability-rule.types";

export interface CreateAvailabilityRuleInput {

    venueId: string;

    title: string;

    description: string;

    type: AvailabilityRuleType;

    frequency: AvailabilityFrequency;

    weekDays: number[];

    startTime: string;

    endTime: string;

    validFrom: Date;

    validTo: Date;

    createdByUserId: string;

}

export async function createAvailabilityRule(

    input: CreateAvailabilityRuleInput,

): Promise<string> {

    const docRef = await addDoc(

        availabilityRulesCollection,

        {

            venueId: input.venueId,

            title: input.title,

            description: input.description,

            type: input.type,

            frequency: input.frequency,

            weekDays: input.weekDays,

            startTime: input.startTime,

            endTime: input.endTime,

            validFrom: Timestamp.fromDate(

                input.validFrom,

            ),

            validTo: Timestamp.fromDate(

                input.validTo,

            ),

            isActive: true,

            createdByUserId:

                input.createdByUserId,

            createdAt:

                serverTimestamp(),

            updatedByUserId: null,

            updatedAt: null,

        },

    );

    return docRef.id;

}

export async function getAvailabilityRulesByVenue(

    venueId: string,

): Promise<AvailabilityRule[]> {

    const q = query(

        availabilityRulesCollection,

        where(
            "venueId",
            "==",
            venueId,
        ),

        where(
            "isActive",
            "==",
            true,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapAvailabilityRule,
    );

}

export async function getActiveAvailabilityRulesByVenue(

    venueId: string,

): Promise<AvailabilityRule[]> {

    return getAvailabilityRulesByVenue(

        venueId,

    );

}