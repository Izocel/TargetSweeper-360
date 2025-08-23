import z from "zod";

/**
 * Represents a single sweep point in the search pattern
 */
export class SweepPoint {
    public readonly longitude: number;
    public readonly latitude: number;
    public readonly radius: number;
    public readonly angle: number;
    public readonly moa: number;
    public readonly timeMinutes: number;
    public readonly description: string | undefined;

    static readonly Schema = z.object({
        longitude: z.number(),
        latitude: z.number(),
        radius: z.number(),
        angle: z.number(),
        moa: z.number(),
        timeMinutes: z.number(),
        description: z.string().optional(),
    });

    constructor(
        longitude: number,
        latitude: number,
        radius: number,
        angle: number,
        moa: number,
        timeMinutes: number,
        description?: string
    ) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.radius = radius;
        this.angle = angle;
        this.moa = moa;
        this.timeMinutes = timeMinutes;
        this.description = description;
    }

    /**
     * Get coordinates as a tuple
     */
    public getCoordinates(): [number, number] {
        return [this.longitude, this.latitude];
    }

    /**
     * Get coordinates as WKT POINT format
     */
    public toWKT(): string {
        return `"POINT (${this.longitude.toFixed(7)} ${this.latitude.toFixed(7)})"`;
    }

    /**
     * Get coordinates for KML format
     */
    public toKMLCoordinates(): string {
        return `${this.longitude},${this.latitude},0`;
    }

    /**
     * Get bearing in degrees
     */
    public getBearing(): number {
        return this.angle;
    }

    /**
     * Get MOA value
     */
    public getMOA(): number {
        return this.moa;
    }

    /**
     * Get distance from target center
     */
    public getDistance(): number {
        return this.radius;
    }

    /**
     * Get time representation in minutes
     */
    public getTime(): number {
        return this.timeMinutes;
    }
}
