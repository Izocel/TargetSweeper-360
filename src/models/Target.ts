/**
 * Represents a target location with coordinates and metadata
 */
export class Target {
    public readonly longitude: number;
    public readonly latitude: number;
    public readonly name: string;

    constructor(longitude: number, latitude: number, name: string = "Target") {
        this.longitude = longitude;
        this.latitude = latitude;
        this.name = name;
    }

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
