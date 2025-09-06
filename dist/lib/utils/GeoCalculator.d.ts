import { Target } from '../models/Target';
/**
 * Utility class for geographic calculations
 */
export declare class GeoCalculator {
    static getDistance(point1: {
        latitude: number;
        longitude: number;
    }, point2: {
        latitude: number;
        longitude: number;
    }): number;
    /**
     * Converts meters to degrees using precise formulas for latitude and longitude.
     * dx: longitude degrees, dy: latitude degrees.
     */
    static offsetInDegrees(meters: number, latitude: number): {
        dx: number;
        dy: number;
    };
    /**
     * Calculates the new latitude and longitude by offsetting a target by a given distance and bearing.
     * Uses the Vincenty formula for higher precision over the Haversine method.
     */
    static offsetTarget(target: Target, distance: number, bearing: number): {
        latitude: number;
        longitude: number;
    };
}
