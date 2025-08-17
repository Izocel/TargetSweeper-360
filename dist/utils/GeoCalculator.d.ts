import { Target } from '../models/Target';
/**
 * Utility class for geographic calculations
 */
export declare class GeoCalculator {
    private static readonly EARTH_RADIUS;
    /**
     * Converts meters to degrees (approximate, valid for small distances)
     */
    static offsetInDegrees(meters: number, latitude: number): {
        dx: number;
        dy: number;
    };
    /**
     * Calculate a point at a given distance and bearing from a target
     */
    static calculatePoint(target: Target, radius: number, angle: number): [number, number];
}
