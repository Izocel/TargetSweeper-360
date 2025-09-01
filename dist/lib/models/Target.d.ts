import z from "zod";
import { GeoCoordinates } from "./GeoCoordinates";
/**
 * Represents a target location with coordinates and metadata
 */
export declare class Target {
    readonly name: string;
    readonly geo: GeoCoordinates;
    constructor(longitude: number, latitude: number, name?: string);
    static readonly Schema: z.ZodObject<{
        name: z.ZodString;
        geo: z.ZodObject<{
            longitude: z.ZodNumber;
            latitude: z.ZodNumber;
            accuracy: z.ZodOptional<z.ZodNumber>;
            altitude: z.ZodOptional<z.ZodNumber>;
            altitudeAccuracy: z.ZodOptional<z.ZodNumber>;
            heading: z.ZodOptional<z.ZodNumber>;
            speed: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}
