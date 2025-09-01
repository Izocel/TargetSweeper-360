import z from "zod";
import { GeoCoordinates } from "./GeoCoordinates";

/**
 * Represents a target location with coordinates and metadata
 */
export class Target {
    readonly name: string;
    readonly geo = new GeoCoordinates();

    constructor(longitude: number, latitude: number, name: string = "Target") {
        this.name = name;
        this.geo.longitude = longitude;
        this.geo.latitude = latitude;
    }

    static readonly Schema = z.object({
        name: z.string(),
        geo: GeoCoordinates.Schema
    });
}