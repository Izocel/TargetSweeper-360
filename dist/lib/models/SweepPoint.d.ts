/**
 * Represents a single sweep point in the search pattern
 */
export declare class SweepPoint {
    readonly longitude: number;
    readonly latitude: number;
    readonly radius: number;
    readonly angle: number;
    readonly moa: number;
    readonly timeMinutes: number;
    readonly description: string | undefined;
    constructor(longitude: number, latitude: number, radius: number, angle: number, moa: number, timeMinutes: number, description?: string);
    /**
     * Get coordinates as a tuple
     */
    getCoordinates(): [number, number];
    /**
     * Get coordinates as WKT POINT format
     */
    toWKT(): string;
    /**
     * Get coordinates for KML format
     */
    toKMLCoordinates(): string;
    /**
     * Get bearing in degrees
     */
    getBearing(): number;
    /**
     * Get MOA value
     */
    getMOA(): number;
    /**
     * Get distance from target center
     */
    getDistance(): number;
    /**
     * Get time representation in minutes
     */
    getTime(): number;
}
