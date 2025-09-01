import { EARTH_RADIUS } from '../..';
import { Target } from '../models/Target';

/**
 * Utility class for geographic calculations
 */
export class GeoCalculator {

    /**
     * Converts meters to degrees (approximate, valid for small distances)
     */
    public static offsetInDegrees(meters: number, latitude: number): { dx: number; dy: number } {
        const latRad = (latitude * Math.PI) / 180;
        const dx = (meters / EARTH_RADIUS) * (180 / Math.PI) / Math.cos(latRad);
        const dy = (meters / EARTH_RADIUS) * (180 / Math.PI);
        return { dx, dy };
    }


    public static offsetTarget(target: Target, distance: number, bearing: number): { latitude: number, longitude: number } {
        const R = EARTH_RADIUS; // Earth's radius in meters
        const φ1 = target.latitude * Math.PI / 180;
        const λ1 = target.longitude * Math.PI / 180;
        const θ = bearing * Math.PI / 180;
        const δ = distance / R;

        const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
        const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));

        return {
            latitude: φ2 * 180 / Math.PI,
            longitude: λ2 * 180 / Math.PI
        };
    }
}
