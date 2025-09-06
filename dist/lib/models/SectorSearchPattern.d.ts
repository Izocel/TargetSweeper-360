import z from "zod";
import { BaseModel } from "./BaseModel";
import { Target } from "./Target";
export declare const SectorSearchPatternSchema: z.ZodObject<{
    datum: z.ZodObject<{
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
    speed: z.ZodNumber;
    radius: z.ZodNumber;
    sectors: z.ZodArray<z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare class SectorSearchPattern extends BaseModel<typeof SectorSearchPatternSchema> {
    constructor(data?: z.infer<typeof SectorSearchPatternSchema>);
    /**
     * Gets the datum target.
     * Represents the central reference point, or the current position of the search buoy
     * @returns The datum target.
     */
    get datum(): Target;
    set datum(datum: Target);
    /**
     * Gets the speed of the search vessel.
     * @returns The speed of the search vessel.
     */
    get speed(): number;
    set speed(speed: number);
    /**
     * Gets the radius of the search pattern.
     * @returns The radius of the search pattern.
     */
    get radius(): number;
    set radius(radius: number);
    /**
     * Gets the sectors of the search pattern.
     * Each sector is an array of 3 targets representing the vertices of a triangle.
     * @returns An array containing 3 sectors, each with 3 targets.
     */
    get sectors(): Target[][];
    set sectors(sectors: Target[][]);
    /**
     * Updates the internal state of the search pattern.
     * @param datum Optional new datum target to update the pattern with.
     */
    update(datum?: Target): void;
    /**
     * Optimized method to update all sectors at once.
     * Reduces redundant calculations and object creations.
     */
    updateAllSectors(): void;
    /**
     * Updates the specified sector with new target positions.
     * @deprecated Use updateAllSectors() for better performance. This method is kept for backward compatibility.
     * @param index The index of the sector to update (0-2).
     */
    updateSector(index: number): void;
    /**
     * Batch update multiple properties without triggering multiple recalculations.
     * More efficient than setting properties individually.
     */
    batchUpdate(updates: {
        datum?: Target;
        speed?: number;
        radius?: number;
    }): void;
    /**
     * Generates KML placemarks for each target in the search pattern.
     * @returns An array of KML placemark strings.
     */
    generateKmlPlacemarks(): string[];
    /**
     * Generates KML polygons (triangles) for each sector in the search pattern.
     * @returns An array of KML polygon strings.
     */
    generateKmlPolygons(): string[];
    /**
     * Generates the KML representation of the search pattern.
     * @returns The KML string.
     */
    generateKml(): string;
}
