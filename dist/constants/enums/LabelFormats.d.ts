/**
 * Label format options for sweep point identification
 * Each format includes cardinal directions, distance, MOA, and time representation
 */
export declare enum LabelFormat {
    /**
     * Military/Tactical Style
     * Format: "DIRECTION-DISTANCE-MOA-TIME"
     * Examples: "N-010-0300-0000", "NNE-050-1500-0025", "E-100-5400-0090"
     */
    TACTICAL = "TACTICAL",
    /**
     * Descriptive Format
     * Format: "DISTANCEm DIRECTION @CLOCKh (TIMEmin/MOAMOA)"
     * Examples: "10m N @12h (0min/300MOA)", "50m NNE @1h (25min/1500MOA)", "100m E @3h (90min/5400MOA)"
     */
    DESCRIPTIVE = "DESCRIPTIVE",
    /**
     * Clock/Navigation Style
     * Format: "RDISTANCE @CLOCK:TIME DIRECTION (DEGREES°/MOAMOA)"
     * Examples: "R10 @12:00 N (0°/300MOA)", "R50 @01:00 NNE (30°/1500MOA)", "R100 @03:00 E (90°/5400MOA)"
     */
    CLOCK_NAVIGATION = "CLOCK_NAVIGATION",
    /**
     * Compact Grid Reference
     * Format: "DIRECTIONDISTANCE-TIME:MINUTES-MOA"
     * Examples: "N10-00:00-300", "NNE50-00:25-1500", "E100-01:30-5400"
     */
    COMPACT_GRID = "COMPACT_GRID",
    /**
     * Bearing/Range Format
     * Format: "BRGBEARING-RNGRANGE-MOAMOA-TTIME"
     * Examples: "BRG000-RNG010-MOA0300-T0000", "BRG030-RNG050-MOA1500-T0025", "BRG090-RNG100-MOA5400-T0090"
     */
    BEARING_RANGE = "BEARING_RANGE",
    /**
     * Search Pattern Format
     * Format: "SP-DIRECTION-DISTANCEm-TIME:MINUTES-MOAMOA"
     * Examples: "SP-N-010m-00:00-300MOA", "SP-NNE-050m-00:25-1500MOA", "SP-E-100m-01:30-5400MOA"
     */
    SEARCH_PATTERN = "SEARCH_PATTERN",
    /**
     * Aviation Style
     * Format: "RADIALBEARING/DISTANCEM/MOA/TIMEZ"
     * Examples: "RADIAL000/010M/0300/0000Z", "RADIAL030/050M/1500/0025Z", "RADIAL090/100M/5400/0090Z"
     */
    AVIATION = "AVIATION",
    /**
     * Simple Time-Distance
     * Format: "DIRECTION DISTANCEm @TIME:MINUTES (MOAMOA)"
     * Examples: "N 10m @00:00 (300MOA)", "NNE 50m @00:25 (1500MOA)", "E 100m @01:30 (5400MOA)"
     */
    SIMPLE = "SIMPLE"
}
/**
 * Interface for label formatting parameters
 */
export interface LabelFormatParams {
    direction: string;
    distance: number;
    angle: number;
    moa: number;
    timeMinutes: number;
    clockHour: number;
    clockMinutes: number;
}
/**
 * Label formatter utility class
 */
export declare class LabelFormatter {
    /**
     * Format a label according to the specified format type
     */
    static formatLabel(format: LabelFormat, params: LabelFormatParams): string;
    /**
     * Get example labels for each format type
     */
    static getExamples(): Record<LabelFormat, string[]>;
}
