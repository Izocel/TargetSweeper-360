import z from "zod";
import { BaseRequest } from "./BaseRequest";
export declare const PutFileProjectRequestSchema: z.ZodObject<{
    file: z.ZodCustom<import("buffer").File, import("buffer").File>;
}, z.core.$strip>;
export declare class PutFileProjectRequest extends BaseRequest {
    readonly schema: z.ZodObject<{
        file: z.ZodCustom<import("buffer").File, import("buffer").File>;
    }, z.core.$strip>;
    readonly data?: z.infer<typeof PutFileProjectRequestSchema>;
    constructor(data: z.infer<typeof PutFileProjectRequestSchema>);
}
