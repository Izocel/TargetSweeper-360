import z from "zod";
/**
 * Configuration class for sweep pattern generation
 */
export declare class SweeperConfigs {
    readonly radiusStep: number;
    readonly maxRadius: number;
    readonly angleStepMOA: number;
    readonly angleStepDegrees: number;
    constructor(radiusStep?: number, maxRadius?: number, angleStepMOA?: number);
    static readonly Schema: z.ZodObject<{
        radiusStep: z.ZodNumber;
        maxRadius: z.ZodNumber;
        angleStepMOA: z.ZodNumber;
        angleStepDegrees: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    /**
     * Get the total number of radius steps
     */
    getRadiusSteps(): number;
    /**
     * Get the total number of angle steps (360° / step size)
     */
    getAngleSteps(): number;
    /**
     * Get the total number of points that will be generated
     */
    getTotalPoints(): number;
    /**
     * Convert MOA to degrees
     */
    moaToDegrees(moa: number): number;
    /**
     * Convert MOA to minutes
     */
    moaToMinutes(moa: number): number;
    /**
     * Get configuration summary
     */
    getSummary(): string;
}
