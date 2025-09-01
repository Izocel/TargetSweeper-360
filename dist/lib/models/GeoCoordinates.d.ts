import z from "zod";
export declare class GeoCoordinates {
    longitude: number;
    latitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
    static readonly Schema: z.ZodObject<{
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
        accuracy: z.ZodOptional<z.ZodNumber>;
        altitude: z.ZodOptional<z.ZodNumber>;
        altitudeAccuracy: z.ZodOptional<z.ZodNumber>;
        heading: z.ZodOptional<z.ZodNumber>;
        speed: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}
