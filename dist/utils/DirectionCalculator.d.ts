/**
 * Utility class for directional calculations and conversions
 */
export declare class DirectionCalculator {
    /**
     * Convert degrees to tactical cardinal direction
     */
    static getTacticalDirection(angle: number): string;
    /**
     * Convert degrees to clock position and direction (legacy format)
     */
    static getClockPosition(angle: number): {
        clock: string;
        direction: string;
    };
}
