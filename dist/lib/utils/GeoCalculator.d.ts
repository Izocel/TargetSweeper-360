import { Target } from '../models/Target';
/**
 * Utility class for geographic calculations
 */
export declare class GeoCalculator {
    /**
     * Converts meters to degrees (approximate, valid for small distances)
     */
    static offsetInDegrees(meters: number, latitude: number): {
        dx: number;
        dy: number;
    };
    static offsetTarget(target: Target, distance: number, bearing: number): {
        latitude: number;
        longitude: number;
    };
}
