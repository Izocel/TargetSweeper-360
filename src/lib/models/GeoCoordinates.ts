import z from "zod";

export class GeoCoordinates {
    longitude: number = 0;
    latitude: number = 0;
    accuracy: number = 0;
    altitude: number | null = null;
    altitudeAccuracy: number | null = null;
    heading: number | null = null;
    speed: number | null = null;

    static readonly Schema = z.object({
        longitude: z.number().min(-180).max(180),
        latitude: z.number().min(-90).max(90),
        accuracy: z.number().optional(),
        altitude: z.number().optional(),
        altitudeAccuracy: z.number().optional(),
        heading: z.number().min(0).max(360).optional(),
        speed: z.number().min(0).optional()
    });
}
