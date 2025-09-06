"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoCalculator = void 0;
const __1 = require("../..");
/**
 * Utility class for geographic calculations
 */
class GeoCalculator {
    static getDistance(point1, point2) {
        const R = __1.EARTH_RADIUS; // Radius of the Earth in meters
        const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
        const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    }
    /**
     * Converts meters to degrees using precise formulas for latitude and longitude.
     * dx: longitude degrees, dy: latitude degrees.
     */
    static offsetInDegrees(meters, latitude) {
        const latRad = (latitude * Math.PI) / 180;
        // One degree of latitude in meters is approximately constant
        const metersPerDegreeLat = 111132.92 - 559.82 * Math.cos(2 * latRad) + 1.175 * Math.cos(4 * latRad) - 0.0023 * Math.cos(6 * latRad);
        // One degree of longitude in meters varies with latitude
        const metersPerDegreeLon = 111412.84 * Math.cos(latRad) - 93.5 * Math.cos(3 * latRad) + 0.118 * Math.cos(5 * latRad);
        const dx = meters / metersPerDegreeLon;
        const dy = meters / metersPerDegreeLat;
        return { dx, dy };
    }
    /**
     * Calculates the new latitude and longitude by offsetting a target by a given distance and bearing.
     * Uses the Vincenty formula for higher precision over the Haversine method.
     */
    static offsetTarget(target, distance, bearing) {
        const a = 6378137; // WGS-84 major axis
        const f = 1 / 298.257223563; // WGS-84 flattening
        const b = (1 - f) * a;
        const φ1 = target.latitude * Math.PI / 180;
        const λ1 = target.longitude * Math.PI / 180;
        const α1 = bearing * Math.PI / 180;
        const s = distance;
        const sinα1 = Math.sin(α1);
        const cosα1 = Math.cos(α1);
        const tanU1 = (1 - f) * Math.tan(φ1);
        const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1);
        const sinU1 = tanU1 * cosU1;
        const σ1 = Math.atan2(tanU1, cosα1);
        const sinα = cosU1 * sinα1;
        const cosSqα = 1 - sinα * sinα;
        const uSq = cosSqα * (a * a - b * b) / (b * b);
        const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
        let σ = s / (b * A);
        let σP = 2 * Math.PI;
        let cos2σM = Math.cos(2 * σ1 + σ); // Initialize before usage
        let sinσ = Math.sin(σ), cosσ = Math.cos(σ), Δσ;
        // Iterate until change in σ is negligible (Vincenty's formula)
        for (let i = 0; Math.abs(σ - σP) > 1e-12 && i < 1000; i++) {
            cos2σM = Math.cos(2 * σ1 + σ);
            sinσ = Math.sin(σ);
            cosσ = Math.cos(σ);
            Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
                B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));
            σP = σ;
            σ = s / (b * A) + Δσ;
        }
        cos2σM = Math.cos(2 * σ1 + σ); // Ensure cos2σM is set for use below
        const tmp = sinU1 * sinσ - cosU1 * cosσ * cosα1;
        const φ2 = Math.atan2(sinU1 * cosσ + cosU1 * sinσ * cosα1, (1 - f) * Math.sqrt(sinα * sinα + tmp * tmp));
        const λ = Math.atan2(sinσ * sinα1, cosU1 * cosσ - sinU1 * sinσ * cosα1);
        const C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
        const L = λ - (1 - C) * f * sinα *
            (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
        const λ2 = λ1 + L;
        return {
            latitude: φ2 * 180 / Math.PI,
            longitude: λ2 * 180 / Math.PI
        };
    }
}
exports.GeoCalculator = GeoCalculator;
//# sourceMappingURL=GeoCalculator.js.map