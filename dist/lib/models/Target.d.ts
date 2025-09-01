import z from "zod";
export declare class Target {
    name: string;
    longitude: number;
    latitude: number;
    altitude: number;
    heading: number;
    fixedHeading: number;
    speed: number;
    fixedSpeed: number;
    accuracy: number;
    altitudeAccuracy: number;
    static readonly Schema: z.ZodObject<{
        name: z.ZodString;
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
        altitude: z.ZodNumber;
        heading: z.ZodNumber;
        fixedHeading: z.ZodNumber;
        speed: z.ZodNumber;
        fixedSpeed: z.ZodNumber;
        accuracy: z.ZodNumber;
        altitudeAccuracy: z.ZodNumber;
    }, z.core.$strip>;
}
