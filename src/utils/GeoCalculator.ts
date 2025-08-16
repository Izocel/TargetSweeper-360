import { Target } from '../models/Target';

/**
 * Utility class for geographic calculations
 */
export class GeoCalculator {
    private static readonly EARTH_RADIUS = 6371000; // meters

    /**
     * Converts meters to degrees (approximate, valid for small distances)
     */
    public static offsetInDegrees(meters: number, latitude: number): { dx: number; dy: number } {
        const latRad = (latitude * Math.PI) / 180;
        const dx = (meters / this.EARTH_RADIUS) * (180 / Math.PI) / Math.cos(latRad);
        const dy = (meters / this.EARTH_RADIUS) * (180 / Math.PI);
        return { dx, dy };
    }

    /**
     * Calculate a point at a given distance and bearing from a target
     */
    public static calculatePoint(
        target: Target,
        radius: number,
        angle: number
    ): [number, number] {
        const radians = (angle * Math.PI) / 180;
        const { dx, dy } = this.offsetInDegrees(radius, target.latitude);
        const longitude = target.longitude + dx * Math.cos(radians);
        const latitude = target.latitude + dy * Math.sin(radians);
        return [longitude, latitude];
    }
}
