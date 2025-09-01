"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProjectRequest = exports.GetProjectRequestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const BaseRequest_1 = require("./BaseRequest");
exports.GetProjectRequestSchema = zod_1.default.object({
    name: zod_1.default.string().max(100),
    type: zod_1.default.string().max(100).optional().default("kml"),
    output: zod_1.default.string().max(100).optional().default("file")
});
class GetProjectRequest extends BaseRequest_1.BaseRequest {
    constructor(data) {
        super(data, exports.GetProjectRequestSchema);
        this.schema = exports.GetProjectRequestSchema;
        this.data = undefined;
    }
}
exports.GetProjectRequest = GetProjectRequest;
//# sourceMappingURL=GetProjectRequest.js.map