import z from 'zod';
import { LabelFormat } from '../constants/enums/LabelFormats';
import { SweeperConfigs } from '../models/SweeperConfigs';
import { SweepPoint } from '../models/SweepPoint';
import { Target } from '../models/Target';
/**
 * Main class for generating sweep patterns around a target
 */
export declare class PatternGenerator {
    private target;
    private labelFormat;
    private config;
    static readonly Schema: z.ZodObject<{
        target: z.ZodObject<{
            name: z.ZodString;
            geo: z.ZodObject<{
                longitude: z.ZodNumber;
                latitude: z.ZodNumber;
                accuracy: z.ZodOptional<z.ZodNumber>;
                altitude: z.ZodOptional<z.ZodNumber>;
                altitudeAccuracy: z.ZodOptional<z.ZodNumber>;
                heading: z.ZodOptional<z.ZodNumber>;
                speed: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
        }, z.core.$strip>;
        config: z.ZodObject<{
            radiusStep: z.ZodNumber;
            maxRadius: z.ZodNumber;
            angleStepMOA: z.ZodNumber;
            angleStepDegrees: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        labelFormat: z.ZodEnum<typeof LabelFormat>;
    }, z.core.$strip>;
    constructor(target: Target, config: SweeperConfigs, labelFormat?: LabelFormat);
    /**
     * Generate all sweep points for the pattern
     */
    generateSweepPoints(): SweepPoint[];
    /**
     * Generate a formatted label for a sweep point
     */
    generateLabel(point: SweepPoint): string;
    /**
     * Generate CSV output
     */
    generateCSV(): string;
    /**
     * Get configuration summary
     */
    getSummary(): {
        target: string;
        maxRadius: number;
        stepSize: string;
        totalPoints: number;
        labelFormat: string;
    };
    /**
     * Set label format
     */
    setLabelFormat(format: LabelFormat): void;
    /**
     * Get current label format
     */
    getLabelFormat(): LabelFormat;
    /**
     * Get target
     */
    getTarget(): Target;
    /**
     * Get configuration
     */
    getConfiguration(): SweeperConfigs;
}
