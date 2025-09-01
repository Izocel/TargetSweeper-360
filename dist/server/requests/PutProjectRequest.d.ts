import z from "zod";
import { LabelFormat } from "../../lib/constants/enums/LabelFormats";
import { BaseRequest } from "./BaseRequest";
export declare const ProjectConfigsSchema: z.ZodObject<{
    name: z.ZodString;
    target: z.ZodLazy<z.ZodObject<{
        name: z.ZodString;
        geo: z.ZodObject<{
            longitude: z.ZodNumber;
            latitude: z.ZodNumber;
            accuracy: z.ZodOptional<z.ZodNumber>;
            altitude: z.ZodOptional<z.ZodNumber>;
            altitudeAccuracy: z.ZodOptional<z.ZodNumber>;
            heading: z.ZodOptional<z.ZodNumber>;
            speed: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    sweeperConfigs: z.ZodLazy<z.ZodObject<{
        radiusStep: z.ZodNumber;
        maxRadius: z.ZodNumber;
        angleStepMOA: z.ZodNumber;
        angleStepDegrees: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    labelFormat: z.ZodDefault<z.ZodOptional<z.ZodEnum<typeof LabelFormat>>>;
}, z.core.$strip>;
export declare class PutProjectRequest extends BaseRequest {
    readonly schema: z.ZodObject<{
        name: z.ZodString;
        target: z.ZodLazy<z.ZodObject<{
            name: z.ZodString;
            geo: z.ZodObject<{
                longitude: z.ZodNumber;
                latitude: z.ZodNumber;
                accuracy: z.ZodOptional<z.ZodNumber>;
                altitude: z.ZodOptional<z.ZodNumber>;
                altitudeAccuracy: z.ZodOptional<z.ZodNumber>;
                heading: z.ZodOptional<z.ZodNumber>;
                speed: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
        }, z.core.$strip>>;
        sweeperConfigs: z.ZodLazy<z.ZodObject<{
            radiusStep: z.ZodNumber;
            maxRadius: z.ZodNumber;
            angleStepMOA: z.ZodNumber;
            angleStepDegrees: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        labelFormat: z.ZodDefault<z.ZodOptional<z.ZodEnum<typeof LabelFormat>>>;
    }, z.core.$strip>;
    readonly data?: z.infer<typeof ProjectConfigsSchema>;
    constructor(data: z.infer<typeof ProjectConfigsSchema>);
}
