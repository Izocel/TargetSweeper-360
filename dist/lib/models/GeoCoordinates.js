"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoCoordinates = void 0;
const zod_1 = __importDefault(require("zod"));
class GeoCoordinates {
    constructor() {
        this.longitude = 0;
        this.latitude = 0;
        this.accuracy = 0;
        this.altitude = null;
        this.altitudeAccuracy = null;
        this.heading = null;
        this.speed = null;
    }
}
exports.GeoCoordinates = GeoCoordinates;
GeoCoordinates.Schema = zod_1.default.object({
    longitude: zod_1.default.number().min(-180).max(180),
    latitude: zod_1.default.number().min(-90).max(90),
    accuracy: zod_1.default.number().optional(),
    altitude: zod_1.default.number().optional(),
    altitudeAccuracy: zod_1.default.number().optional(),
    heading: zod_1.default.number().min(0).max(360).optional(),
    speed: zod_1.default.number().min(0).optional()
});
//# sourceMappingURL=GeoCoordinates.js.map