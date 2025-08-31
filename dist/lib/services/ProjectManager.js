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
const SweeperConfigs_1 = require("../models/SweeperConfigs");
const Target_1 = require("../models/Target");
const KMLGenerator_1 = require("./KMLGenerator");
/**
 * Manages project configurations and generates outputs
 */
class ProjectManager {
    static async generate(request) {
        const data = request.data;
        const { name, labelFormat } = data;
        // Create configurations
        const target = new Target_1.Target(data.target.longitude, data.target.latitude);
        const sweeper = new SweeperConfigs_1.SweeperConfigs(data.sweeperConfigs.radiusStep, data.sweeperConfigs.maxRadius, data.sweeperConfigs.angleStepMOA);
        // Generators
        const kmlGenerator = new KMLGenerator_1.KMLGenerator(target, sweeper, labelFormat);
        const patternGenerator = kmlGenerator.getPatternGenerator();
        // Output paths
        const suffix = Date.now();
        const baseName = name.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '_');
        const projectName = `${baseName}_${suffix}`;
        const outputPath = path.join(ProjectManager.outputBaseDir, projectName);
        // Generate KML files & summary
        const summary = patternGenerator.getSummary();
        await kmlGenerator.generateAllFiles(outputPath, sweeper);
        const files = await this.getProjectByName(projectName, "all");
        files?.forEach(f => {
            delete f.path;
        });
        return {
            projectName,
            summary,
            files
        };
    }
    /**
     * Get project details by name
     * @param name The project name
     * @param type The file type to filter by (default is "kml")
     * @returns The project files and their content
     */
    static async getProjectByName(name, type = "kml") {
        const lookoutPath = path.join(ProjectManager.outputBaseDir, `${name}`);
        if (!fs.existsSync(lookoutPath)) {
            throw new Error(`Project with name "${name}" does not exist.`);
        }
        const results = [];
        const files = fs.readdirSync(lookoutPath);
        if (files.length === 0) {
            throw new Error(`No files found for project "${name}".`);
        }
        for (const file of files) {
            const filePath = path.join(lookoutPath, file);
            const fileType = path.extname(filePath).replace('.', '');
            if (type !== "all" && fileType !== type) {
                continue;
            }
            results.push({
                path: filePath,
                extension: fileType,
                endpoint: `api/projects?name=${name}`,
                content: fs.readFileSync(filePath, 'utf-8')
            });
        }
        return results;
    }
    static async storeFile(request) {
        const file = request.data.file;
        if (!file) {
            throw new Error('File was not found !');
        }
        const suffix = Date.now();
        let projectName = file.originalname.replace(path.extname(file.originalname), "");
        projectName = projectName.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '_');
        projectName = `${projectName}_${suffix}`;
        const folderPath = path.join(ProjectManager.outputBaseDir, projectName);
        const filePath = path.join(folderPath, file.originalname);
        await fs.promises.mkdir(folderPath, { recursive: true });
        await fs.promises.copyFile(file.path, filePath);
        await fs.promises.unlink(file.path);
        console.log(` 📄  Stored: ${path.basename(filePath)}`);
        const results = await this.getProjectByName(projectName, "kml");
        results?.forEach(f => {
            delete f.path;
        });
        return results;
    }
}
exports.ProjectManager = ProjectManager;
ProjectManager.outputBaseDir = path.join(process.cwd(), 'projects');
//# sourceMappingURL=ProjectManager.js.map