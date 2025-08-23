"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectConfigs = void 0;
const zod_1 = require("zod");
const LabelFormats_1 = require("../constants/enums/LabelFormats");
const SweeperConfigs_1 = require("./SweeperConfigs");
const Target_1 = require("./Target");
class ProjectConfigs {
    constructor(name, target, labelFormat, sweeperConfigs) {
        this.Name = name;
        this.Target = target;
        this.LabelFormat = labelFormat;
        this.SweeperConfigs = sweeperConfigs;
    }
}
exports.ProjectConfigs = ProjectConfigs;
ProjectConfigs.Schema = zod_1.z.object({
    Name: zod_1.z.string(),
    Target: Target_1.Target.Schema,
    LabelFormat: zod_1.z.enum(LabelFormats_1.LabelFormat),
    SweeperConfigs: SweeperConfigs_1.SweeperConfigs.Schema,
});
//# sourceMappingURL=ProjectConfigs.js.map