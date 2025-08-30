"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutFileProjectRequest = exports.PutFileProjectRequestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const BaseRequest_1 = require("./BaseRequest");
exports.PutFileProjectRequestSchema = zod_1.default.object({
    file: zod_1.default.instanceof(File).refine(file => file.type === "application/vnd.google-earth.kml+xml", {
        message: "Invalid file type. Only KML files are allowed."
    })
});
class PutFileProjectRequest extends BaseRequest_1.BaseRequest {
    constructor(data) {
        super(data, exports.PutFileProjectRequestSchema);
        this.schema = exports.PutFileProjectRequestSchema;
    }
}
exports.PutFileProjectRequest = PutFileProjectRequest;
//# sourceMappingURL=PutFileProjectRequest.js.map