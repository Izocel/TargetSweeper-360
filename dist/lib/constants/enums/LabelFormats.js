"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelFormatter = exports.LabelFormat = void 0;
/**
 * Label format options for sweep point identification
 * Each format includes cardinal directions, distance, MOA, and time representation
 */
var LabelFormat;
(function (LabelFormat) {
    /**
     * Military/Tactical Style
     * Format: "DIRECTION-DISTANCE-MOA-TIME"
     * Examples: "N-010-0300-0000", "NNE-050-1500-0025", "E-100-5400-0090"
     */
    LabelFormat["TACTICAL"] = "TACTICAL";
    /**
     * Descriptive Format
     * Format: "DISTANCEm DIRECTION @CLOCKh (TIMEmin/MOAMOA)"
     * Examples: "10m N @12h (0min/300MOA)", "50m NNE @1h (25min/1500MOA)", "100m E @3h (90min/5400MOA)"
     */
    LabelFormat["DESCRIPTIVE"] = "DESCRIPTIVE";
    /**
     * Clock/Navigation Style
     * Format: "RDISTANCE @CLOCK:TIME DIRECTION (DEGREES°/MOAMOA)"
     * Examples: "R10 @12:00 N (0°/300MOA)", "R50 @01:00 NNE (30°/1500MOA)", "R100 @03:00 E (90°/5400MOA)"
     */
    LabelFormat["CLOCK_NAVIGATION"] = "CLOCK_NAVIGATION";
    /**
     * Compact Grid Reference
     * Format: "DIRECTIONDISTANCE-TIME:MINUTES-MOA"
     * Examples: "N10-00:00-300", "NNE50-00:25-1500", "E100-01:30-5400"
     */
    LabelFormat["COMPACT_GRID"] = "COMPACT_GRID";
    /**
     * Bearing/Range Format
     * Format: "BRGBEARING-RNGRANGE-MOAMOA-TTIME"
     * Examples: "BRG000-RNG010-MOA0300-T0000", "BRG030-RNG050-MOA1500-T0025", "BRG090-RNG100-MOA5400-T0090"
     */
    LabelFormat["BEARING_RANGE"] = "BEARING_RANGE";
    /**
     * Search Pattern Format
     * Format: "SP-DIRECTION-DISTANCEm-TIME:MINUTES-MOAMOA"
     * Examples: "SP-N-010m-00:00-300MOA", "SP-NNE-050m-00:25-1500MOA", "SP-E-100m-01:30-5400MOA"
     */
    LabelFormat["SEARCH_PATTERN"] = "SEARCH_PATTERN";
    /**
     * Aviation Style
     * Format: "RADIALBEARING/DISTANCEM/MOA/TIMEZ"
     * Examples: "RADIAL000/010M/0300/0000Z", "RADIAL030/050M/1500/0025Z", "RADIAL090/100M/5400/0090Z"
     */
    LabelFormat["AVIATION"] = "AVIATION";
    /**
     * Simple Time-Distance
     * Format: "DIRECTION DISTANCEm @TIME:MINUTES (MOAMOA)"
     * Examples: "N 10m @00:00 (300MOA)", "NNE 50m @00:25 (1500MOA)", "E 100m @01:30 (5400MOA)"
     */
    LabelFormat["SIMPLE"] = "SIMPLE";
})(LabelFormat || (exports.LabelFormat = LabelFormat = {}));
/**
 * Label formatter utility class
 */
class LabelFormatter {
    /**
     * Format a label according to the specified format type
     */
    static formatLabel(format, params) {
        const { direction, distance, angle, moa, timeMinutes, clockHour, clockMinutes } = params;
        const distanceStr = distance.toString().padStart(3, '0');
        const moaStr = Math.round(moa).toString().padStart(4, '0');
        const timeStr = Math.floor(timeMinutes).toString().padStart(4, '0');
        const bearingStr = Math.round(angle).toString().padStart(3, '0');
        const clockStr = `${clockHour.toString().padStart(2, '0')}:${clockMinutes.toString().padStart(2, '0')}`;
        switch (format) {
            case LabelFormat.TACTICAL:
                return `${direction}-${distanceStr}-${moaStr}-${timeStr}`;
            case LabelFormat.DESCRIPTIVE:
                return `${distance}m ${direction} @${clockHour}h (${Math.floor(timeMinutes)}min/${Math.round(moa)}MOA)`;
            case LabelFormat.CLOCK_NAVIGATION:
                return `R${distance} @${clockStr} ${direction} (${Math.round(angle)}°/${Math.round(moa)}MOA)`;
            case LabelFormat.COMPACT_GRID:
                return `${direction}${distance}-${clockStr}-${Math.round(moa)}`;
            case LabelFormat.BEARING_RANGE:
                return `BRG${bearingStr}-RNG${distanceStr}-MOA${moaStr}-T${timeStr}`;
            case LabelFormat.SEARCH_PATTERN:
                return `SP-${direction}-${distanceStr}m-${clockStr}-${Math.round(moa)}MOA`;
            case LabelFormat.AVIATION:
                return `RADIAL${bearingStr}/${distanceStr}M/${moaStr}/${timeStr}Z`;
            case LabelFormat.SIMPLE:
                return `${direction} ${distance}m @${clockStr} (${Math.round(moa)}MOA)`;
            default:
                return `${direction}-${distanceStr}-${moaStr}-${timeStr}`;
        }
    }
    /**
     * Get example labels for each format type
     */
    static getExamples() {
        const exampleParams = {
            direction: "N",
            distance: 10,
            angle: 0,
            moa: 300,
            timeMinutes: 0,
            clockHour: 12,
            clockMinutes: 0
        };
        const examples = {};
        Object.values(LabelFormat).forEach(format => {
            examples[format] = [
                this.formatLabel(format, exampleParams),
                this.formatLabel(format, { ...exampleParams, direction: "NNE", distance: 50, angle: 30, moa: 1500, timeMinutes: 25, clockHour: 1, clockMinutes: 0 }),
                this.formatLabel(format, { ...exampleParams, direction: "E", distance: 100, angle: 90, moa: 5400, timeMinutes: 90, clockHour: 3, clockMinutes: 0 })
            ];
        });
        return examples;
    }
}
exports.LabelFormatter = LabelFormatter;
//# sourceMappingURL=LabelFormats.js.map