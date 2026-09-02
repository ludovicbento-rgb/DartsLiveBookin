import {
    describe,
    expect,
    it,
} from "vitest";

import {
    addMinutes,
    toMinutes,
    toTime,
} from "./time";

describe("Time utilities", () => {

    describe("toMinutes()", () => {

        it("should convert midnight", () => {

            expect(
                toMinutes("00:00"),
            ).toBe(0);

        });

        it("should convert 18:00", () => {

            expect(
                toMinutes("18:00"),
            ).toBe(1080);

        });

        it("should convert 22:30", () => {

            expect(
                toMinutes("22:30"),
            ).toBe(1350);

        });

    });

    describe("toTime()", () => {

        it("should convert 0", () => {

            expect(
                toTime(0),
            ).toBe("00:00");

        });

        it("should convert 1080", () => {

            expect(
                toTime(1080),
            ).toBe("18:00");

        });

        it("should convert 1350", () => {

            expect(
                toTime(1350),
            ).toBe("22:30");

        });

    });

    describe("addMinutes()", () => {

        it("should add 45 minutes", () => {

            expect(

                addMinutes(
                    "18:00",
                    45,
                ),

            ).toBe("18:45");

        });

        it("should add 90 minutes", () => {

            expect(

                addMinutes(
                    "18:00",
                    90,
                ),

            ).toBe("19:30");

        });

        it("should add 150 minutes", () => {

            expect(

                addMinutes(
                    "18:00",
                    150,
                ),

            ).toBe("20:30");

        });

        it("should cross midnight", () => {

            expect(

                addMinutes(
                    "23:30",
                    30,
                ),

            ).toBe("00:00");

        });

        it("should add one full day", () => {

            expect(

                addMinutes(
                    "00:00",
                    1440,
                ),

            ).toBe("00:00");

        });

        it("should keep leading zeros", () => {

            expect(

                addMinutes(
                    "09:05",
                    10,
                ),

            ).toBe("09:15");

        });

    });

});