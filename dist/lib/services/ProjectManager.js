"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ProjectConfigs_1 = require("../models/ProjectConfigs");
const KMLGenerator_1 = require("./KMLGenerator");
/**
 * Manages project configurations and generates outputs
 * @param config The project configuration
 * @param outputDir The output directory for generated files
 */
class ProjectManager {
    /**
     * Validate a project generation configuration
     * @param config The project configuration
     */
    static validateConfig(config) {
        const results = ProjectConfigs_1.ProjectConfigs.Schema.safeParse(config);
        if (!results.success) {
            const errors = results.error.issues.map(issue => issue.message);
            console.error(`Invalid project configuration: ${errors.join('; ')}`);
            return { valid: false, errors };
        }
        return { valid: true };
    }
    /**
     * Generate project files
     * @param configs The project configuration
     */
    static async generate(configs) {
        const validation = this.validateConfig(configs);
        if (!validation.valid) {
            throw new Error(`Invalid project configuration: ${validation.errors?.join('; ')}`);
        }
        const { Target, SweeperConfigs, Name, LabelFormat } = configs;
        // Generators
        const kmlGenerator = new KMLGenerator_1.KMLGenerator(Target, SweeperConfigs, LabelFormat);
        const patternGenerator = kmlGenerator.getPatternGenerator();
        // Output paths
        const suffix = Date.now();
        const baseName = Name.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '_');
        const outputPath = path.join(ProjectManager.outputBaseDir, `${baseName}_${suffix}`);
        // Generate KML files & summary
        const summary = patternGenerator.getSummary();
        const files = await kmlGenerator.generateAllFiles(outputPath, configs);
        for (const file of files) {
            console.log(`  📄  Generated: ${path.basename(file.path)}`);
        }
        return {
            files,
            summary
        };
    }
    /**
     * Get project details by name
     * @param name The project name
     * @param type The file type to filter by (default is ".kml")
     * @returns The project files and their content
     */
    static async getProjectByName(name, type = "kml") {
        const lookoutPath = path.join(ProjectManager.outputBaseDir, `${name}`);
        if (!fs.existsSync(lookoutPath)) {
            throw new Error(`Project with name "${name}" does not exist.`);
        }
        const results = [];
        const files = fs.readdirSync(lookoutPath);
        for (const file of files) {
            const filePath = path.join(lookoutPath, file);
            const fileType = path.extname(filePath).replace('.', '');
            if (fileType !== type) {
                continue;
            }
            results.push({
                path: filePath,
                content: fs.readFileSync(filePath, 'utf-8')
            });
        }
        return results.length ? results : undefined;
    }
}
exports.ProjectManager = ProjectManager;
ProjectManager.outputBaseDir = path.join(process.cwd(), 'projects');
//# sourceMappingURL=ProjectManager.js.map