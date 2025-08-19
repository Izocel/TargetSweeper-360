"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoCalculator = void 0;
/**
 * Utility class for geographic calculations
 */
class GeoCalculator {
    /**
     * Converts meters to degrees (approximate, valid for small distances)
     */
    static offsetInDegrees(meters, latitude) {
        const latRad = (latitude * Math.PI) / 180;
        const dx = (meters / this.EARTH_RADIUS) * (180 / Math.PI) / Math.cos(latRad);
        const dy = (meters / this.EARTH_RADIUS) * (180 / Math.PI);
        return { dx, dy };
    }
    /**
     * Calculate a point at a given distance and bearing from a target
     */
    static calculatePoint(target, radius, angle) {
        const radians = (angle * Math.PI) / 180;
        const { dx, dy } = this.offsetInDegrees(radius, target.latitude);
        const longitude = target.longitude + dx * Math.cos(radians);
        const latitude = target.latitude + dy * Math.sin(radians);
        return [longitude, latitude];
    }
}
exports.GeoCalculator = GeoCalculator;
GeoCalculator.EARTH_RADIUS = 6371000; // meters
//# sourceMappingURL=GeoCalculator.js.map