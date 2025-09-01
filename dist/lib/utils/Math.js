"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBoundary = handleBoundary;
exports.handleOverflow = handleOverflow;
/**
 * Constrains a value to be within a specified range.
 * If the value is less than the minimum, it will return the minimum.
 * If the value is greater than the maximum, it will return the maximum.
 * For example, applying bounds to an angle of 370 degrees with a range of 0 to 360 will result in 360 degrees.
 */
function handleBoundary(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
/**
 * Wraps a value within a specified range.
 * If the value exceeds the maximum, it will wrap around to the minimum.
 * If the value is below the minimum, it will wrap around to the maximum.
 * For example, applying overflow to an angle of 370 degrees with a range of 0 to 360 will result in 10 degrees.
 */
function handleOverflow(value, min, max) {
    if (value > max) {
        return min + ((value - max) % (max - min));
    }
    else if (value < min) {
        return max - ((min - value) % (max - min));
    }
    return value;
}
//# sourceMappingURL=Math.js.map