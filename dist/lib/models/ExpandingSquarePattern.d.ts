import z from "zod";
import { BaseModel } from "./BaseModel";
import { Target } from "./Target";
export declare const ExpandingSquarePatternSchema: z.ZodObject<{
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
    height: z.ZodNumber;
    width: z.ZodNumber;
    vesselVisualDistance: z.ZodNumber;
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
export declare class ExpandingSquarePattern extends BaseModel<typeof ExpandingSquarePatternSchema> {
    constructor(data?: z.infer<typeof ExpandingSquarePatternSchema>);
    get datum(): Target;
    set datum(datum: Target);
    get speed(): number;
    set speed(speed: number);
    get height(): number;
    set height(height: number);
    get width(): number;
    set width(width: number);
    get vesselVisualDistance(): number;
    set vesselVisualDistance(vesselVisualDistance: number);
    get targets(): Target[];
    set targets(targets: Target[]);
    /**
     * Updates the internal state of the search pattern.
     * @param datum Optional new datum target to update the pattern with.
     */
    update(datum?: Target): void;
    updateTargets(): void;
    /**
     * Generates KML placemarks for each target in the search pattern.
     * @returns An array of KML placemark strings.
     */
    generateKmlPlacemarks(): string[];
    /**
     * Generates KML polygons for the expanding square pattern.
     * @returns An array of KML polygon strings.
     */
    generateKmlPolygons(): string[];
    /**
     * Generates the KML representation of the search pattern.
     * @returns The KML string.
     */
    generateKml(): string;
}
