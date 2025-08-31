import z from "zod";
import { BaseRequest } from "./BaseRequest";
export declare const UploadProjectRequestSchema: z.ZodObject<{
    file: z.ZodCustom<File | Express.Multer.File | undefined, File | Express.Multer.File | undefined>;
}, z.core.$strip>;
export declare class UploadProjectRequest extends BaseRequest {
    readonly schema: z.ZodObject<{
        file: z.ZodCustom<File | Express.Multer.File | undefined, File | Express.Multer.File | undefined>;
    }, z.core.$strip>;
    readonly data?: z.infer<typeof UploadProjectRequestSchema>;
    readonly formData: FormData;
    constructor(data: z.infer<typeof UploadProjectRequestSchema>);
}
