"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Target = void 0;
const zod_1 = __importDefault(require("zod"));
const GeoCoordinates_1 = require("./GeoCoordinates");
/**
 * Represents a target location with coordinates and metadata
 */
class Target {
    constructor(longitude, latitude, name = "Target") {
        this.geo = new GeoCoordinates_1.GeoCoordinates();
        this.name = name;
        this.geo.longitude = longitude;
        this.geo.latitude = latitude;
    }
}
exports.Target = Target;
Target.Schema = zod_1.default.object({
    name: zod_1.default.string(),
    geo: GeoCoordinates_1.GeoCoordinates.Schema
});
//# sourceMappingURL=Target.js.map