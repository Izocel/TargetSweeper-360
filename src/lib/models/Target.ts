import z from "zod";

export class Target {
    name: string = "Target";
    longitude: number = 0;
    latitude: number = 0;
    altitude: number = 0;
    heading: number = 0;
    speed: number = 0;
    accuracy: number = 0;
    altitudeAccuracy: number = 0;

    stepTime: number = 0;
    stepSpeed: number = 0;
    stepHeading: number = 0;
    stepDistance: number = 0;

    static readonly Schema = z.object({
        name: z.string(),
        longitude: z.number().min(-180).max(180),
        latitude: z.number().min(-90).max(90),
        altitude: z.number(),
        heading: z.number().min(0).max(360),
        speed: z.number().min(0),
        accuracy: z.number(),
        altitudeAccuracy: z.number(),

        stepTime: z.number().min(0),
        stepSpeed: z.number().min(0),
        stepHeading: z.number().min(0).max(360),
        stepDistance: z.number().min(0),
    });


}