"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Target = exports.SweepPatternGenerator = exports.SweepConfiguration = exports.ProjectManager = exports.LabelFormat = exports.KMLGenerator = exports.EARTH_RADIUS = void 0;
const LabelFormats_1 = require("./constants/enums/LabelFormats");
Object.defineProperty(exports, "LabelFormat", { enumerable: true, get: function () { return LabelFormats_1.LabelFormat; } });
const SweepConfiguration_1 = require("./models/SweepConfiguration");
Object.defineProperty(exports, "SweepConfiguration", { enumerable: true, get: function () { return SweepConfiguration_1.SweepConfiguration; } });
const Target_1 = require("./models/Target");
Object.defineProperty(exports, "Target", { enumerable: true, get: function () { return Target_1.Target; } });
const KMLGenerator_1 = require("./services/KMLGenerator");
Object.defineProperty(exports, "KMLGenerator", { enumerable: true, get: function () { return KMLGenerator_1.KMLGenerator; } });
const ProjectManager_1 = require("./services/ProjectManager");
Object.defineProperty(exports, "ProjectManager", { enumerable: true, get: function () { return ProjectManager_1.ProjectManager; } });
const SweepPatternGenerator_1 = require("./services/SweepPatternGenerator");
Object.defineProperty(exports, "SweepPatternGenerator", { enumerable: true, get: function () { return SweepPatternGenerator_1.SweepPatternGenerator; } });
// 🌍 Earth radius in meters
exports.EARTH_RADIUS = 6378137.0;
//# sourceMappingURL=index.js.map