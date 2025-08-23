import z from "zod";
import { BaseRequest } from "./BaseRequest";
export declare const ProjectConfigsSchema: z.ZodObject<{
    name: z.ZodString;
    target: z.ZodLazy<any>;
    sweeperConfigs: z.ZodLazy<any>;
    labelFormat: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        [x: string]: any;
    }>>>;
}, z.core.$strip>;
export declare class PutProjectRequest extends BaseRequest {
    readonly schema: z.ZodObject<{
        name: z.ZodString;
        target: z.ZodLazy<any>;
        sweeperConfigs: z.ZodLazy<any>;
        labelFormat: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            [x: string]: any;
        }>>>;
    }, z.core.$strip>;
    readonly data?: z.infer<typeof ProjectConfigsSchema>;
    constructor(data: z.infer<typeof ProjectConfigsSchema>);
}
