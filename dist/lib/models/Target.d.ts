import z from "zod";
export declare class Target {
    name: string;
    longitude: number;
    latitude: number;
    altitude: number;
    heading: number;
    speed: number;
    accuracy: number;
    altitudeAccuracy: number;
    stepTime: number;
    stepSpeed: number;
    stepHeading: number;
    stepDistance: number;
    static readonly Schema: z.ZodObject<{
        name: z.ZodString;
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
        altitude: z.ZodNumber;
        heading: z.ZodNumber;
        speed: z.ZodNumber;
        accuracy: z.ZodNumber;
        altitudeAccuracy: z.ZodNumber;
        stepTime: z.ZodNumber;
        stepSpeed: z.ZodNumber;
        stepHeading: z.ZodNumber;
        stepDistance: z.ZodNumber;
    }, z.core.$strip>;
}
