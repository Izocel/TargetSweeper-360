"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBoundary = handleBoundary;
exports.handleOverflow = handleOverflow;
exports.handleFlooredOverflow = handleFlooredOverflow;
exports.handleCeiledOverflow = handleCeiledOverflow;
/**
 * Constrains a value to be within a specified range.
 * If the value is less than the minimum, it will return the minimum.
 * If the value is greater than the maximum, it will return the maximum.
 * For example, applying bounds to an angle of 370 degrees with a range of 0 to 360 will result in 360 degrees.
 */
function handleBoundary(value, min, max) {
    return (value < min) ? min : (value > max) ? max : value;
}
/**
 * Wraps a value within a specified range.
 * If the value exceeds the maximum, it will wrap around to the minimum.
 * If the value is below the minimum, it will wrap around to the maximum.
 * For example, applying overflow to an angle of 370 degrees with a range of 0 to 360 will result in 10 degrees.
 */
function handleOverflow(value, min, max) {
    return (value > max) ? min + ((value - max) % (max - min))
        : (value < min) ? max - ((min - value) % (max - min))
            : value;
}
/** Similar to handleOverflow, but treats the maximum as exclusive.
 * If the value equals or exceeds the maximum, it will wrap around to the minimum.
 * If the value is below the minimum, it will wrap around to just below the maximum.
 * For example, applying floored overflow to an angle of 360 degrees with a range of 0 to 360 will result in 0 degrees.
 */
function handleFlooredOverflow(value, min, max) {
    const wrapped = handleOverflow(value, min, max);
    return (wrapped === max) ? min : wrapped;
}
/** Similar to handleOverflow, but treats the minimum as exclusive.
 * If the value exceeds the maximum, it will wrap around to just above the minimum.
 * If the value equals or is below the minimum, it will wrap around to the maximum.
 * For example, applying ceiled overflow to an angle of 0 degrees with a range of 0 to 360 will result in 359.99 degrees.
 */
function handleCeiledOverflow(value, min, max) {
    const wrapped = handleOverflow(value, min, max);
    return (wrapped === min) ? max : wrapped;
}
//# sourceMappingURL=Math.js.map