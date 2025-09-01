import z from "zod";
import { BaseRequest } from "./BaseRequest";

export const UploadProjectRequestSchema = z.object({
    file: z.custom<File | Express.Multer.File | Blob | undefined>((file) => {
        if (!file || !(file as any).size) return false;
        const type = (file as File | Blob).type ?? (file as Express.Multer.File).mimetype;

        return type === "application/vnd.google-earth.kml+xml";
    }, {
        message: "Invalid file type. Only KML files are allowed."
    })
});

export class UploadProjectRequest extends BaseRequest {
    readonly schema = UploadProjectRequestSchema;
    readonly data?: z.infer<typeof UploadProjectRequestSchema> = undefined;
    readonly formData: FormData;

    constructor(data: z.infer<typeof UploadProjectRequestSchema>) {
        super(data, UploadProjectRequestSchema);
        this.formData = new FormData();
        this.formData.append('file', data.file as Blob);
    }
}