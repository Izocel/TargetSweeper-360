"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Target = void 0;
const zod_1 = __importDefault(require("zod"));
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
Target.Schema = zod_1.default.object({
    name: zod_1.default.string(),
    longitude: zod_1.default.number(),
    latitude: zod_1.default.number(),
});
//# sourceMappingURL=Target.js.map