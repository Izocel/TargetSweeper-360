import z from "zod";
import { LabelFormat } from "../../lib/constants/enums/LabelFormats";
import { BaseRequest } from "./BaseRequest";
export declare const ProjectConfigsSchema: z.ZodObject<{
    name: z.ZodString;
    target: z.ZodObject<{
        name: z.ZodString;
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
        altitude: z.ZodNumber;
        heading: z.ZodNumber;
        fixedHeading: z.ZodNumber;
        speed: z.ZodNumber;
        fixedSpeed: z.ZodNumber;
        accuracy: z.ZodNumber;
        altitudeAccuracy: z.ZodNumber;
    }, z.core.$strip>;
    sweeperConfigs: z.ZodObject<{
        radiusStep: z.ZodNumber;
        maxRadius: z.ZodNumber;
        angleStepMOA: z.ZodNumber;
        angleStepDegrees: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    labelFormat: z.ZodDefault<z.ZodOptional<z.ZodEnum<typeof LabelFormat>>>;
}, z.core.$strip>;
export declare class PutProjectRequest extends BaseRequest {
    readonly schema: z.ZodObject<{
        name: z.ZodString;
        target: z.ZodObject<{
            name: z.ZodString;
            longitude: z.ZodNumber;
            latitude: z.ZodNumber;
            altitude: z.ZodNumber;
            heading: z.ZodNumber;
            fixedHeading: z.ZodNumber;
            speed: z.ZodNumber;
            fixedSpeed: z.ZodNumber;
            accuracy: z.ZodNumber;
            altitudeAccuracy: z.ZodNumber;
        }, z.core.$strip>;
        sweeperConfigs: z.ZodObject<{
            radiusStep: z.ZodNumber;
            maxRadius: z.ZodNumber;
            angleStepMOA: z.ZodNumber;
            angleStepDegrees: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        labelFormat: z.ZodDefault<z.ZodOptional<z.ZodEnum<typeof LabelFormat>>>;
    }, z.core.$strip>;
    readonly data?: z.infer<typeof ProjectConfigsSchema>;
    constructor(data: z.infer<typeof ProjectConfigsSchema>);
}
