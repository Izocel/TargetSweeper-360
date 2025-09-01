"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Target = void 0;
const zod_1 = __importDefault(require("zod"));
class Target {
    constructor() {
        this.name = "Target";
        this.longitude = 0;
        this.latitude = 0;
        this.altitude = 0;
        this.heading = 0;
        this.fixedHeading = 0;
        this.speed = 0;
        this.fixedSpeed = 0;
        this.accuracy = 0;
        this.altitudeAccuracy = 0;
    }
}
exports.Target = Target;
Target.Schema = zod_1.default.object({
    name: zod_1.default.string(),
    longitude: zod_1.default.number().min(-180).max(180),
    latitude: zod_1.default.number().min(-90).max(90),
    altitude: zod_1.default.number(),
    heading: zod_1.default.number().min(0).max(360),
    fixedHeading: zod_1.default.number().min(0).max(360),
    speed: zod_1.default.number().min(0),
    fixedSpeed: zod_1.default.number().min(0),
    accuracy: zod_1.default.number(),
    altitudeAccuracy: zod_1.default.number(),
});
//# sourceMappingURL=Target.js.map