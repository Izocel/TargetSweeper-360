"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SweepPatternGenerator = void 0;
const SweepPoint_1 = require("../models/SweepPoint");
const GeoCalculator_1 = require("../utils/GeoCalculator");
const DirectionCalculator_1 = require("../utils/DirectionCalculator");
const LabelFormats_1 = require("../constants/enums/LabelFormats");
/**
 * Main class for generating sweep patterns around a target
 */
class SweepPatternGenerator {
    constructor(target, config, labelFormat = LabelFormats_1.LabelFormat.SIMPLE) {
        this.target = target;
        this.config = config;
        this.labelFormat = labelFormat;
    }
    /**
     * Generate all sweep points for the pattern
     */
    generateSweepPoints() {
        const points = [];
        for (let radius = this.config.radiusStep; radius <= this.config.maxRadius; radius += this.config.radiusStep) {
            for (let angleMOA = 0; angleMOA < 21600; angleMOA += this.config.angleStepMOA) {
                const angle = this.config.moaToDegrees(angleMOA);
                const [longitude, latitude] = GeoCalculator_1.GeoCalculator.calculatePoint(this.target, radius, angle);
                const timeMinutes = this.config.moaToMinutes(angleMOA);
                const point = new SweepPoint_1.SweepPoint(longitude, latitude, radius, angle, angleMOA, timeMinutes, `Sweep point at ${radius}m, ${angle}° from target`);
                points.push(point);
            }
        }
        return points;
    }
    /**
     * Generate a formatted label for a sweep point
     */
    generateLabel(point) {
        const direction = DirectionCalculator_1.DirectionCalculator.getTacticalDirection(point.angle);
        const clockPosition = DirectionCalculator_1.DirectionCalculator.getClockPosition(point.angle);
        const params = {
            direction,
            distance: point.radius,
            angle: point.angle,
            moa: point.moa,
            timeMinutes: point.timeMinutes,
            clockHour: parseInt(clockPosition.clock.replace('h', '')),
            clockMinutes: Math.floor((point.timeMinutes % 60))
        };
        return LabelFormats_1.LabelFormatter.formatLabel(this.labelFormat, params);
    }
    /**
     * Generate CSV output
     */
    generateCSV() {
        const points = this.generateSweepPoints();
        const lines = [];
        lines.push("WKT,Description");
        // Add target point at the beginning
        const targetWKT = `"POINT (${this.target.longitude} ${this.target.latitude})"`;
        lines.unshift(`${targetWKT},Target | ${this.target.name}`);
        // Add all sweep points
        for (const point of points) {
            const label = this.generateLabel(point);
            lines.push(`${point.toWKT()},${label}`);
        }
        return lines.join('\n');
    }
    /**
     * Get configuration summary
     */
    getSummary() {
        return {
            target: this.target.toString(),
            maxRadius: this.config.maxRadius,
            stepSize: `${this.config.radiusStep}m every ${this.config.moaToMinutes(this.config.angleStepMOA)}min (${this.config.angleStepDegrees}°)`,
            totalPoints: this.config.getTotalPoints(),
            labelFormat: this.labelFormat
        };
    }
    /**
     * Set label format
     */
    setLabelFormat(format) {
        this.labelFormat = format;
    }
    /**
     * Get current label format
     */
    getLabelFormat() {
        return this.labelFormat;
    }
    /**
     * Get target
     */
    getTarget() {
        return this.target;
    }
    /**
     * Get configuration
     */
    getConfiguration() {
        return this.config;
    }
}
exports.SweepPatternGenerator = SweepPatternGenerator;
//# sourceMappingURL=SweepPatternGenerator.js.map