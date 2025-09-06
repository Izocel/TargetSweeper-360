import z from "zod";
import { BaseModel } from "./BaseModel";
import { Target } from "./Target";
export declare const ParallelTrackPatternSchema: z.ZodObject<{
    vector: z.ZodObject<{
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
    spacing: z.ZodNumber;
    targets: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare class ParallelTrackPattern extends BaseModel<typeof ParallelTrackPatternSchema> {
    constructor(data?: z.infer<typeof ParallelTrackPatternSchema>);
    get vector(): Target;
    set vector(vector: Target);
    get speed(): number;
    set speed(speed: number);
    get spacing(): number;
    set spacing(spacing: number);
    get targets(): Target[];
    set targets(targets: Target[]);
    /**
     * Updates the internal state of the search pattern.
     * @param vector Optional new vector target to update the pattern with.
     */
    update(vector?: Target): void;
    updateTargets(): void;
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
