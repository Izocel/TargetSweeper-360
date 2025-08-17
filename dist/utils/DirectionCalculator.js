"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectionCalculator = void 0;
/**
 * Utility class for directional calculations and conversions
 */
class DirectionCalculator {
    /**
     * Convert degrees to tactical cardinal direction
     */
    static getTacticalDirection(angle) {
        // Normalize angle to 0-360 range
        const normalizedAngle = ((angle % 360) + 360) % 360;
        const directions = [
            { min: 348.75, max: 360, code: "N" },
            { min: 0, max: 11.25, code: "N" },
            { min: 11.25, max: 33.75, code: "NNE" },
            { min: 33.75, max: 56.25, code: "NE" },
            { min: 56.25, max: 78.75, code: "ENE" },
            { min: 78.75, max: 101.25, code: "E" },
            { min: 101.25, max: 123.75, code: "ESE" },
            { min: 123.75, max: 146.25, code: "SE" },
            { min: 146.25, max: 168.75, code: "SSE" },
            { min: 168.75, max: 191.25, code: "S" },
            { min: 191.25, max: 213.75, code: "SSW" },
            { min: 213.75, max: 236.25, code: "SW" },
            { min: 236.25, max: 258.75, code: "WSW" },
            { min: 258.75, max: 281.25, code: "W" },
            { min: 281.25, max: 303.75, code: "WNW" },
            { min: 303.75, max: 326.25, code: "NW" },
            { min: 326.25, max: 348.75, code: "NNW" }
        ];
        for (const dir of directions) {
            if (normalizedAngle >= dir.min && normalizedAngle < dir.max) {
                return dir.code;
            }
        }
        return "N"; // fallback
    }
    /**
     * Convert degrees to clock position and direction (legacy format)
     */
    static getClockPosition(angle) {
        // Normalize angle to 0-360 range
        const normalizedAngle = ((angle % 360) + 360) % 360;
        // Convert to clock position (12 o'clock = 0°/360°, 3 o'clock = 90°, etc.)
        const clockAngle = (normalizedAngle + 90) % 360; // Adjust for clock orientation
        const hour = Math.round(clockAngle / 30) || 12; // 30° per hour, 0 becomes 12
        // Get cardinal/intercardinal direction
        const directions = [
            { angle: 0, name: "north" },
            { angle: 45, name: "northeast" },
            { angle: 90, name: "east" },
            { angle: 135, name: "southeast" },
            { angle: 180, name: "south" },
            { angle: 225, name: "southwest" },
            { angle: 270, name: "west" },
            { angle: 315, name: "northwest" }
        ];
        // Find closest direction
        let closestDir = directions[0];
        let minDiff = Math.abs(normalizedAngle - directions[0].angle);
        for (const dir of directions) {
            const diff = Math.min(Math.abs(normalizedAngle - dir.angle), Math.abs(normalizedAngle - (dir.angle + 360)), Math.abs(normalizedAngle + 360 - dir.angle));
            if (diff < minDiff) {
                minDiff = diff;
                closestDir = dir;
            }
        }
        return {
            clock: `${hour}h`,
            direction: closestDir.name
        };
    }
}
exports.DirectionCalculator = DirectionCalculator;
//# sourceMappingURL=DirectionCalculator.js.map