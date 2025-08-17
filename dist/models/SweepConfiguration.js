"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SweepConfiguration = void 0;
/**
 * Configuration class for sweep pattern generation
 */
class SweepConfiguration {
    constructor(radiusStep = 10, maxRadius = 500, angleStepMOA = 300) {
        this.radiusStep = radiusStep;
        this.maxRadius = maxRadius;
        this.angleStepMOA = angleStepMOA;
        this.angleStepDegrees = angleStepMOA / 60; // Convert MOA to degrees
    }
    /**
     * Get the total number of radius steps
     */
    getRadiusSteps() {
        return Math.floor(this.maxRadius / this.radiusStep);
    }
    /**
     * Get the total number of angle steps (360° / step size)
     */
    getAngleSteps() {
        return Math.floor(21600 / this.angleStepMOA); // 360° = 21600 MOA
    }
    /**
     * Get the total number of points that will be generated
     */
    getTotalPoints() {
        return this.getRadiusSteps() * this.getAngleSteps();
    }
    /**
     * Convert MOA to degrees
     */
    moaToDegrees(moa) {
        return moa / 60;
    }
    /**
     * Convert MOA to minutes
     */
    moaToMinutes(moa) {
        return moa / 60;
    }
    /**
     * Get configuration summary
     */
    getSummary() {
        return `Radius: ${this.maxRadius}m, Step: ${this.radiusStep}m, Angle: ${this.moaToMinutes(this.angleStepMOA)}min (${this.angleStepDegrees}°), Points: ${this.getTotalPoints()}`;
    }
}
exports.SweepConfiguration = SweepConfiguration;
//# sourceMappingURL=SweepConfiguration.js.map