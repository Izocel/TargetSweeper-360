"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadProjectRequest = exports.UploadProjectRequestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const BaseRequest_1 = require("./BaseRequest");
exports.UploadProjectRequestSchema = zod_1.default.object({
    file: zod_1.default.custom((file) => {
        if (!file || !file.size)
            return false;
        const type = file.type ?? file.mimetype;
        return type === "application/vnd.google-earth.kml+xml";
    }, {
        message: "Invalid file type. Only KML files are allowed."
    })
});
class UploadProjectRequest extends BaseRequest_1.BaseRequest {
    constructor(data) {
        super(data, exports.UploadProjectRequestSchema);
        this.schema = exports.UploadProjectRequestSchema;
        this.data = undefined;
        this.formData = new FormData();
        this.formData.append('file', data.file);
    }
}
exports.UploadProjectRequest = UploadProjectRequest;
//# sourceMappingURL=UploadProjectRequest.js.map