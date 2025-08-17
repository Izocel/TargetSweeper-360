"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelFormat = exports.ProjectManager = exports.KMZGenerator = exports.SweepPatternGenerator = exports.SweepConfiguration = exports.Target = void 0;
const Target_1 = require("./models/Target");
Object.defineProperty(exports, "Target", { enumerable: true, get: function () { return Target_1.Target; } });
const SweepConfiguration_1 = require("./models/SweepConfiguration");
Object.defineProperty(exports, "SweepConfiguration", { enumerable: true, get: function () { return SweepConfiguration_1.SweepConfiguration; } });
const SweepPatternGenerator_1 = require("./services/SweepPatternGenerator");
Object.defineProperty(exports, "SweepPatternGenerator", { enumerable: true, get: function () { return SweepPatternGenerator_1.SweepPatternGenerator; } });
const KMZGenerator_1 = require("./services/KMZGenerator");
Object.defineProperty(exports, "KMZGenerator", { enumerable: true, get: function () { return KMZGenerator_1.KMZGenerator; } });
const ProjectManager_1 = require("./services/ProjectManager");
Object.defineProperty(exports, "ProjectManager", { enumerable: true, get: function () { return ProjectManager_1.ProjectManager; } });
const LabelFormats_1 = require("./constants/enums/LabelFormats");
Object.defineProperty(exports, "LabelFormat", { enumerable: true, get: function () { return LabelFormats_1.LabelFormat; } });
/**
 * Main application entry point
 */
async function main() {
    try {
        // Use ProjectManager to generate from projects.json
        const projectManager = new ProjectManager_1.ProjectManager();
        console.log('🎯 TargetSweeper-360 - Generating Projects');
        console.log('==========================================');
        // Generate all projects from configuration
        const results = await projectManager.generateAllProjects();
        if (results.failed > 0) {
            console.log('\n❌ Some projects failed to generate. Check the error messages above.');
            process.exit(1);
        }
        else {
            console.log('\n🎉 All projects generated successfully!');
        }
    }
    catch (error) {
        console.error('❌ Error generating projects:', error);
        process.exit(1);
    }
}
// Run the main function if this file is executed directly
if (require.main === module) {
    main();
}
//# sourceMappingURL=index.js.map