import { Target } from '../models/Target';
import { SweepPoint } from '../models/SweepPoint';
import { SweepConfiguration } from '../models/SweepConfiguration';
import { LabelFormat } from '../constants/enums/LabelFormats';
/**
 * Main class for generating sweep patterns around a target
 */
export declare class SweepPatternGenerator {
    private target;
    private labelFormat;
    private config;
    constructor(target: Target, config: SweepConfiguration, labelFormat?: LabelFormat);
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
    getConfiguration(): SweepConfiguration;
}
