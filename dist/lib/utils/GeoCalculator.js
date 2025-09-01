"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoCalculator = void 0;
const __1 = require("../..");
/**
 * Utility class for geographic calculations
 */
class GeoCalculator {
    /**
     * Converts meters to degrees (approximate, valid for small distances)
     */
    static offsetInDegrees(meters, latitude) {
        const latRad = (latitude * Math.PI) / 180;
        const dx = (meters / __1.EARTH_RADIUS) * (180 / Math.PI) / Math.cos(latRad);
        const dy = (meters / __1.EARTH_RADIUS) * (180 / Math.PI);
        return { dx, dy };
    }
    static offsetTarget(target, distance, bearing) {
        const R = __1.EARTH_RADIUS; // Earth's radius in meters
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
exports.GeoCalculator = GeoCalculator;
//# sourceMappingURL=GeoCalculator.js.map