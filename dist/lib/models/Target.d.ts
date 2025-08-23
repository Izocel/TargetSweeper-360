import z from "zod";
/**
 * Represents a target location with coordinates and metadata
 */
export declare class Target {
    readonly name: string;
    readonly longitude: number;
    readonly latitude: number;
    static readonly Schema: z.ZodObject<{
        name: z.ZodString;
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
    }, z.core.$strip>;
    constructor(longitude: number, latitude: number, name?: string);
    /**
     * Get target coordinates as a tuple
     */
    getCoordinates(): [number, number];
    /**
     * Get target as a coordinate string for KML/CSV
     */
    toCoordinateString(): string;
    /**
     * Get target information as a formatted string
     */
    toString(): string;
}
