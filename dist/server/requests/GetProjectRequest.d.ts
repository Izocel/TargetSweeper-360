import z from "zod";
import { BaseRequest } from "./BaseRequest";
export declare const GetProjectRequestSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    output: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare class GetProjectRequest extends BaseRequest {
    readonly schema: z.ZodObject<{
        name: z.ZodString;
        type: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        output: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
    readonly data?: z.infer<typeof GetProjectRequestSchema>;
    constructor(data: Partial<z.infer<typeof GetProjectRequestSchema>>);
}
