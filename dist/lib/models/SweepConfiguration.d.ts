/**
 * Configuration class for sweep pattern generation
 */
export declare class SweepConfiguration {
    readonly radiusStep: number;
    readonly maxRadius: number;
    readonly angleStepMOA: number;
    readonly angleStepDegrees: number;
    constructor(radiusStep?: number, maxRadius?: number, angleStepMOA?: number);
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
