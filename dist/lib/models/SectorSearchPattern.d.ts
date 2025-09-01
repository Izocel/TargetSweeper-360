import { Target } from "./Target";
export declare class SectorSearchPattern {
    /**
     * The center point of the search
     * This is the point from which the search pattern is generated
     */
    datum: Target;
    /**
     * The 9 sectors of the search pattern
     * Each sector is represented by a 2D array of Targets
     * Sectors 1-9 correspond to the tactical search pattern diagram
     */
    sectors: Target[][];
    /**
     * The radius of the sector (in meters)
     * This is the distance from the center point to the edge of the sector
     */
    radius: number;
    /**
     * The speed of the search pattern
     * This is the speed at which the search pattern is executed
     */
    speed: number;
    constructor(datum: Target, radius?: number, speed?: number);
    /**
     * Updates the search pattern with new values.
     * @param datum The new values to update the search pattern with.
     * @param radius The new radius of the search pattern.
     * @param speed The new speed of the search pattern.
     */
    updateDatum(datum: Target): void;
    /**
     * Updates the specified sector with new target positions.
     * @param index The index of the sector to update (0-2).
     */
    updateSector(index: number): void;
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
