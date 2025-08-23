"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetSweeperApi = exports.Target = exports.SweeperConfigs = exports.ProjectManager = exports.PatternGenerator = exports.LabelFormat = exports.KMLGenerator = exports.EARTH_RADIUS = void 0;
const index_1 = __importDefault(require("../api/index"));
exports.TargetSweeperApi = index_1.default;
const LabelFormats_1 = require("./constants/enums/LabelFormats");
Object.defineProperty(exports, "LabelFormat", { enumerable: true, get: function () { return LabelFormats_1.LabelFormat; } });
const SweeperConfigs_1 = require("./models/SweeperConfigs");
Object.defineProperty(exports, "SweeperConfigs", { enumerable: true, get: function () { return SweeperConfigs_1.SweeperConfigs; } });
const Target_1 = require("./models/Target");
Object.defineProperty(exports, "Target", { enumerable: true, get: function () { return Target_1.Target; } });
const KMLGenerator_1 = require("./services/KMLGenerator");
Object.defineProperty(exports, "KMLGenerator", { enumerable: true, get: function () { return KMLGenerator_1.KMLGenerator; } });
const PatternGenerator_1 = require("./services/PatternGenerator");
Object.defineProperty(exports, "PatternGenerator", { enumerable: true, get: function () { return PatternGenerator_1.PatternGenerator; } });
const ProjectManager_1 = require("./services/ProjectManager");
Object.defineProperty(exports, "ProjectManager", { enumerable: true, get: function () { return ProjectManager_1.ProjectManager; } });
// 🌍 Earth radius in meters
exports.EARTH_RADIUS = 6378137.0;
//# sourceMappingURL=index.js.map