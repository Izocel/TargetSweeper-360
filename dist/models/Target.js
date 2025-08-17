"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Target = void 0;
/**
 * Represents a target location with coordinates and metadata
 */
class Target {
    constructor(longitude, latitude, name = "Target") {
        this.longitude = longitude;
        this.latitude = latitude;
        this.name = name;
    }
    /**
     * Get target coordinates as a tuple
     */
    getCoordinates() {
        return [this.longitude, this.latitude];
    }
    /**
     * Get target as a coordinate string for KML/CSV
     */
    toCoordinateString() {
        return `${this.longitude},${this.latitude}`;
    }
    /**
     * Get target information as a formatted string
     */
    toString() {
        return `${this.name} (${this.latitude}, ${this.longitude})`;
    }
}
exports.Target = Target;
//# sourceMappingURL=Target.js.map