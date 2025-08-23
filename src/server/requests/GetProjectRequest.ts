

import z from "zod";
import { BaseRequest } from "./BaseRequest";

export const GetProjectRequestSchema = z.object({
    name: z.string().max(100),
    type: z.string().max(100).optional().default("kml"),
    output: z.string().max(100).optional().default("file")
});

export class GetProjectRequest extends BaseRequest {
    readonly schema = GetProjectRequestSchema;
    readonly data?: z.infer<typeof GetProjectRequestSchema>;

    constructor(data: Partial<z.infer<typeof GetProjectRequestSchema>>) {
        super(data, GetProjectRequestSchema);
    }
}