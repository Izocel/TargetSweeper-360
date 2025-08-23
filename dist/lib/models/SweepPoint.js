"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SweepPoint = void 0;
const zod_1 = __importDefault(require("zod"));
/**
 * Represents a single sweep point in the search pattern
 */
class SweepPoint {
    constructor(longitude, latitude, radius, angle, moa, timeMinutes, description) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.radius = radius;
        this.angle = angle;
        this.moa = moa;
        this.timeMinutes = timeMinutes;
        this.description = description;
    }
    /**
     * Get coordinates as a tuple
     */
    getCoordinates() {
        return [this.longitude, this.latitude];
    }
    /**
     * Get coordinates as WKT POINT format
     */
    toWKT() {
        return `"POINT (${this.longitude.toFixed(7)} ${this.latitude.toFixed(7)})"`;
    }
    /**
     * Get coordinates for KML format
     */
    toKMLCoordinates() {
        return `${this.longitude},${this.latitude},0`;
    }
    /**
     * Get bearing in degrees
     */
    getBearing() {
        return this.angle;
    }
    /**
     * Get MOA value
     */
    getMOA() {
        return this.moa;
    }
    /**
     * Get distance from target center
     */
    getDistance() {
        return this.radius;
    }
    /**
     * Get time representation in minutes
     */
    getTime() {
        return this.timeMinutes;
    }
}
exports.SweepPoint = SweepPoint;
SweepPoint.Schema = zod_1.default.object({
    longitude: zod_1.default.number(),
    latitude: zod_1.default.number(),
    radius: zod_1.default.number(),
    angle: zod_1.default.number(),
    moa: zod_1.default.number(),
    timeMinutes: zod_1.default.number(),
    description: zod_1.default.string().optional(),
});
//# sourceMappingURL=SweepPoint.js.map