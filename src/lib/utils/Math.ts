/**
 * Constrains a value to be within a specified range.
 * If the value is less than the minimum, it will return the minimum.
 * If the value is greater than the maximum, it will return the maximum.
 * For example, applying bounds to an angle of 370 degrees with a range of 0 to 360 will result in 360 degrees.
 */
export function handleBoundary(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Wraps a value within a specified range.
 * If the value exceeds the maximum, it will wrap around to the minimum.
 * If the value is below the minimum, it will wrap around to the maximum.
 * For example, applying overflow to an angle of 370 degrees with a range of 0 to 360 will result in 10 degrees.
 */
export function handleOverflow(value: number, min: number, max: number): number {
    if (value > max) {
        return min + ((value - max) % (max - min));
    } else if (value < min) {
        return max - ((min - value) % (max - min));
    }
    return value;
}