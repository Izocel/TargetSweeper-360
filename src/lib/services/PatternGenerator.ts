import z from 'zod';
import { LabelFormat, LabelFormatParams, LabelFormatter } from '../constants/enums/LabelFormats';
import { SweeperConfigs } from '../models/SweeperConfigs';
import { SweepPoint } from '../models/SweepPoint';
import { Target } from '../models/Target';
import { DirectionCalculator } from '../utils/DirectionCalculator';
import { GeoCalculator } from '../utils/GeoCalculator';

/**
 * Main class for generating sweep patterns around a target
 */
export class PatternGenerator {
    private target: Target;
    private labelFormat: LabelFormat;
    private config: SweeperConfigs;

    static readonly Schema = z.object({
        target: Target.Schema,
        config: SweeperConfigs.Schema,
        labelFormat: z.enum(LabelFormat)
    });

    constructor(
        target: Target,
        config: SweeperConfigs,
        labelFormat: LabelFormat = LabelFormat.SIMPLE
    ) {
        this.target = target;
        this.config = config;
        this.labelFormat = labelFormat;
    }

    /**
     * Generate all sweep points for the pattern
     */
    public generateSweepPoints(): SweepPoint[] {
        const points: SweepPoint[] = [];

        for (let radius = this.config.radiusStep; radius <= this.config.maxRadius; radius += this.config.radiusStep) {
            for (let angleMOA = 0; angleMOA < 21600; angleMOA += this.config.angleStepMOA) {
                const angle = this.config.moaToDegrees(angleMOA);
                const [longitude, latitude] = GeoCalculator.calculatePoint(this.target, radius, angle);
                const timeMinutes = this.config.moaToMinutes(angleMOA);

                const point = new SweepPoint(
                    longitude,
                    latitude,
                    radius,
                    angle,
                    angleMOA,
                    timeMinutes,
                    `Sweep point at ${radius}m, ${angle}° from target`
                );

                points.push(point);
            }
        }

        return points;
    }

    /**
     * Generate a formatted label for a sweep point
     */
    public generateLabel(point: SweepPoint): string {
        const direction = DirectionCalculator.getTacticalDirection(point.angle);
        const clockPosition = DirectionCalculator.getClockPosition(point.angle);

        const params: LabelFormatParams = {
            direction,
            distance: point.radius,
            angle: point.angle,
            moa: point.moa,
            timeMinutes: point.timeMinutes,
            clockHour: parseInt(clockPosition.clock.replace('h', '')),
            clockMinutes: Math.floor((point.timeMinutes % 60))
        };

        return LabelFormatter.formatLabel(this.labelFormat, params);
    }

    /**
     * Generate CSV output
     */
    public generateCSV(): string {
        const points = this.generateSweepPoints();
        const lines: string[] = [];

        lines.push("WKT,Description");

        // Add target point at the beginning
        const targetWKT = `"POINT (${this.target.geo.longitude} ${this.target.geo.latitude})"`;
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
    public getSummary(): {
        target: string;
        maxRadius: number;
        stepSize: string;
        totalPoints: number;
        labelFormat: string;
    } {
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
    public setLabelFormat(format: LabelFormat): void {
        this.labelFormat = format;
    }

    /**
     * Get current label format
     */
    public getLabelFormat(): LabelFormat {
        return this.labelFormat;
    }

    /**
     * Get target
     */
    public getTarget(): Target {
        return this.target;
    }

    /**
     * Get configuration
     */
    public getConfiguration(): SweeperConfigs {
        return this.config;
    }
}
