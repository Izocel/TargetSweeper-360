"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutProjectRequest = exports.ProjectConfigsSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const LabelFormats_1 = require("../../lib/constants/enums/LabelFormats");
const SweeperConfigs_1 = require("../../lib/models/SweeperConfigs");
const Target_1 = require("../../lib/models/Target");
const BaseRequest_1 = require("./BaseRequest");
exports.ProjectConfigsSchema = zod_1.default.object({
    name: zod_1.default.string(),
    target: Target_1.Target.Schema,
    sweeperConfigs: SweeperConfigs_1.SweeperConfigs.Schema,
    labelFormat: zod_1.default.enum(LabelFormats_1.LabelFormat).optional().default(LabelFormats_1.LabelFormat.SIMPLE),
});
class PutProjectRequest extends BaseRequest_1.BaseRequest {
    constructor(data) {
        super(data, exports.ProjectConfigsSchema);
        this.schema = exports.ProjectConfigsSchema;
        this.data = undefined;
    }
}
exports.PutProjectRequest = PutProjectRequest;
//# sourceMappingURL=PutProjectRequest.js.map