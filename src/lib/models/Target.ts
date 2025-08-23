import z from "zod";

/**
 * Represents a target location with coordinates and metadata
 */
export class Target {
    public readonly name: string;
    public readonly longitude: number;
    public readonly latitude: number;

    constructor(longitude: number, latitude: number, name: string = "Target") {
        this.longitude = longitude;
        this.latitude = latitude;
        this.name = name;
    }

    static readonly Schema = z.object({
        name: z.string(),
        longitude: z.number(),
        latitude: z.number(),
    });

    /**
     * Get target coordinates as a tuple
     */
    public getCoordinates(): [number, number] {
        return [this.longitude, this.latitude];
    }

    /**
     * Get target as a coordinate string for KML/CSV
     */
    public toCoordinateString(): string {
        return `${this.longitude},${this.latitude}`;
    }

    /**
     * Get target information as a formatted string
     */
    public toString(): string {
        return `${this.name} (${this.latitude}, ${this.longitude})`;
    }
}