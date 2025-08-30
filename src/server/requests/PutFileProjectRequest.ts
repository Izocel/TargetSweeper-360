import z from "zod";
import { BaseRequest } from "./BaseRequest";

export const PutFileProjectRequestSchema = z.object({
    file: z.file().refine(file => file.type === "application/vnd.google-earth.kml+xml", {
        message: "Invalid file type. Only KML files are allowed."
    })
});

export class PutFileProjectRequest extends BaseRequest {
    readonly schema = PutFileProjectRequestSchema;
    readonly data?: z.infer<typeof PutFileProjectRequestSchema>;

    constructor(data: z.infer<typeof PutFileProjectRequestSchema>) {
        super(data, PutFileProjectRequestSchema);
    }
}