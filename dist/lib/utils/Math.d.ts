/**
 * Constrains a value to be within a specified range.
 * If the value is less than the minimum, it will return the minimum.
 * If the value is greater than the maximum, it will return the maximum.
 * For example, applying bounds to an angle of 370 degrees with a range of 0 to 360 will result in 360 degrees.
 */
export declare function handleBoundary(value: number, min: number, max: number): number;
/**
 * Wraps a value within a specified range.
 * If the value exceeds the maximum, it will wrap around to the minimum.
 * If the value is below the minimum, it will wrap around to the maximum.
 * For example, applying overflow to an angle of 370 degrees with a range of 0 to 360 will result in 10 degrees.
 */
export declare function handleOverflow(value: number, min: number, max: number): number;
/** Similar to handleOverflow, but treats the maximum as exclusive.
 * If the value equals or exceeds the maximum, it will wrap around to the minimum.
 * If the value is below the minimum, it will wrap around to just below the maximum.
 * For example, applying floored overflow to an angle of 360 degrees with a range of 0 to 360 will result in 0 degrees.
 */
export declare function handleFlooredOverflow(value: number, min: number, max: number): number;
/** Similar to handleOverflow, but treats the minimum as exclusive.
 * If the value exceeds the maximum, it will wrap around to just above the minimum.
 * If the value equals or is below the minimum, it will wrap around to the maximum.
 * For example, applying ceiled overflow to an angle of 0 degrees with a range of 0 to 360 will result in 359.99 degrees.
 */
export declare function handleCeiledOverflow(value: number, min: number, max: number): number;
/**
 * Calculates the length of the side opposite to the given angle in a triangle using the Law of Cosines.
 * @param base - Length of one side of the triangle.
 * @param side - Length of the other side of the triangle.
 */
export declare function getTriangleSideLength(base: number, side: number, angleDegrees: number): number;
/** Calculates the length of the equal sides in an isosceles triangle given the base and the vertex angle.
 * @param base - Length of the base of the isoscele triangle.
 * @param angleDegrees - Vertex angle in degrees.
 */
export declare function getIsosceleTriangleSideLength(base: number, angleDegrees: number): number;
