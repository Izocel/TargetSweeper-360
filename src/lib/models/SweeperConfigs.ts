import z from "zod";

/**
 * Configuration class for sweep pattern generation
 */
export class SweeperConfigs {
    public readonly radiusStep: number;
    public readonly maxRadius: number;
    public readonly angleStepMOA: number;
    public readonly angleStepDegrees: number;

    constructor(
        radiusStep: number = 10,
        maxRadius: number = 500,
        angleStepMOA: number = 300
    ) {
        this.radiusStep = radiusStep;
        this.maxRadius = maxRadius;
        this.angleStepMOA = angleStepMOA;
        this.angleStepDegrees = angleStepMOA / 60; // Convert MOA to degrees
    }


    static readonly Schema = z.object({
        radiusStep: z.number(),
        maxRadius: z.number(),
        angleStepMOA: z.number(),
        angleStepDegrees: z.number().optional(),
    });


    /**
     * Get the total number of radius steps
     */
    public getRadiusSteps(): number {
        return Math.floor(this.maxRadius / this.radiusStep);
    }

    /**
     * Get the total number of angle steps (360° / step size)
     */
    public getAngleSteps(): number {
        return Math.floor(21600 / this.angleStepMOA); // 360° = 21600 MOA
    }

    /**
     * Get the total number of points that will be generated
     */
    public getTotalPoints(): number {
        return this.getRadiusSteps() * this.getAngleSteps();
    }

    /**
     * Convert MOA to degrees
     */
    public moaToDegrees(moa: number): number {
        return moa / 60;
    }

    /**
     * Convert MOA to minutes
     */
    public moaToMinutes(moa: number): number {
        return moa / 60;
    }

    /**
     * Get configuration summary
     */
    public getSummary(): string {
        return `Radius: ${this.maxRadius}m, Step: ${this.radiusStep}m, Angle: ${this.moaToMinutes(this.angleStepMOA)}min (${this.angleStepDegrees}°), Points: ${this.getTotalPoints()}`;
    }
}
