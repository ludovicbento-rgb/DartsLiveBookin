import {
    getDocs,
    query,
    where,
    doc,
    updateDoc,
} from "firebase/firestore";

import {
    addDoc,
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

    validFrom: string;

    validTo: string;

    createdByUserId: string;

}

export interface UpdateAvailabilityRuleInput {

    title: string;

    description: string;

    type: AvailabilityRuleType;

    frequency: AvailabilityFrequency;

    weekDays: number[];

    startTime: string;

    endTime: string;

    validFrom: string;

    validTo: string;

    updatedByUserId: string;

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

            validFrom: input.validFrom,

            validTo: input.validTo,

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

export async function updateAvailabilityRule(

    ruleId: string,

    input: UpdateAvailabilityRuleInput,

): Promise<void> {

    const reference =
        doc(
            availabilityRulesCollection,
            ruleId,
        );

    await updateDoc(

        reference,

        {

            title:
                input.title,

            description:
                input.description,

            type:
                input.type,

            frequency:
                input.frequency,

            weekDays:
                input.weekDays,

            startTime:
                input.startTime,

            endTime:
                input.endTime,

            validFrom:
                input.validFrom,

            validTo:
                input.validTo,

            updatedByUserId:
                input.updatedByUserId,

            updatedAt:
                serverTimestamp(),

        },

    );

}

export async function setAvailabilityRuleActive(

    ruleId: string,

    isActive: boolean,

    updatedByUserId: string,

): Promise<void> {

    const reference =
        doc(
            availabilityRulesCollection,
            ruleId,
        );

    await updateDoc(

        reference,

        {

            isActive,

            updatedByUserId,

            updatedAt:
                serverTimestamp(),

        },

    );

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