import z from "zod";
import { BaseRequest } from "./BaseRequest";

export const PutFileProjectRequestSchema = z.object({
    file: z.instanceof(File).refine(file => file.type === "application/vnd.google-earth.kml+xml")
});

export class PutFileProjectRequest extends BaseRequest {
    readonly schema = PutFileProjectRequestSchema;
    readonly data?: z.infer<typeof PutFileProjectRequestSchema>;

    constructor(data: z.infer<typeof PutFileProjectRequestSchema>) {
        super(data, PutFileProjectRequestSchema);
    }
}