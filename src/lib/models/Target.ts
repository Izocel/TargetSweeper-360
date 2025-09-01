import z from "zod";

export class Target {
    name: string = "Target";
    longitude: number = 0;
    latitude: number = 0;
    altitude: number = 0;
    heading: number = 0;
    fixedHeading: number = 0;
    speed: number = 0;
    fixedSpeed: number = 0;
    accuracy: number = 0;
    altitudeAccuracy: number = 0;

    static readonly Schema = z.object({
        name: z.string(),
        longitude: z.number().min(-180).max(180),
        latitude: z.number().min(-90).max(90),
        altitude: z.number(),
        heading: z.number().min(0).max(360),
        fixedHeading: z.number().min(0).max(360),
        speed: z.number().min(0),
        fixedSpeed: z.number().min(0),
        accuracy: z.number(),
        altitudeAccuracy: z.number(),
    });


}