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
const Target_1 = require("../models/Target");
const SweepConfiguration_1 = require("../models/SweepConfiguration");
const KMZGenerator_1 = require("./KMZGenerator");
const LabelFormats_1 = require("../constants/enums/LabelFormats");
/**
 * Manages project configurations and generates outputs
 */
class ProjectManager {
    constructor(projectsConfigPath, outputBaseDir) {
        this.projectsConfigPath = projectsConfigPath || path.join(process.cwd(), 'conf', 'projects.json');
        this.outputBaseDir = outputBaseDir || path.join(process.cwd(), 'projects');
    }
    /**
     * Load and parse the projects configuration file
     */
    loadProjectsConfig() {
        try {
            if (!fs.existsSync(this.projectsConfigPath)) {
                throw new Error(`Projects configuration file not found: ${this.projectsConfigPath}`);
            }
            const configContent = fs.readFileSync(this.projectsConfigPath, 'utf-8');
            const config = JSON.parse(configContent);
            if (!config.generations || !Array.isArray(config.generations)) {
                throw new Error('Invalid projects configuration: missing or invalid generations array');
            }
            return config;
        }
        catch (error) {
            throw new Error(`Failed to load projects configuration: ${error}`);
        }
    }
    /**
     * Validate a project generation configuration
     */
    validateGeneration(generation, index) {
        const errors = [];
        if (!generation.ProjectName || typeof generation.ProjectName !== 'string') {
            errors.push(`Generation ${index}: ProjectName is required and must be a string`);
        }
        if (!generation.Target) {
            errors.push(`Generation ${index}: Target is required`);
        }
        else {
            if (typeof generation.Target.longitude !== 'number') {
                errors.push(`Generation ${index}: Target.longitude must be a number`);
            }
            if (typeof generation.Target.latitude !== 'number') {
                errors.push(`Generation ${index}: Target.latitude must be a number`);
            }
            if (!generation.Target.name || typeof generation.Target.name !== 'string') {
                errors.push(`Generation ${index}: Target.name is required and must be a string`);
            }
        }
        if (!generation.Sweeper) {
            errors.push(`Generation ${index}: Sweeper is required`);
        }
        else {
            if (typeof generation.Sweeper.radiusStep !== 'number' || generation.Sweeper.radiusStep <= 0) {
                errors.push(`Generation ${index}: Sweeper.radiusStep must be a positive number`);
            }
            if (typeof generation.Sweeper.maxRadius !== 'number' || generation.Sweeper.maxRadius <= 0) {
                errors.push(`Generation ${index}: Sweeper.maxRadius must be a positive number`);
            }
            if (typeof generation.Sweeper.angleStepMOA !== 'number' || generation.Sweeper.angleStepMOA <= 0) {
                errors.push(`Generation ${index}: Sweeper.angleStepMOA must be a positive number`);
            }
            if (!generation.Sweeper.format || typeof generation.Sweeper.format !== 'string') {
                errors.push(`Generation ${index}: Sweeper.format is required and must be a string`);
            }
        }
        if (errors.length > 0) {
            throw new Error(`Validation errors:\n${errors.join('\n')}`);
        }
    }
    /**
     * Convert project generation config to domain models
     */
    convertToModels(generation) {
        const target = new Target_1.Target(generation.Target.longitude, generation.Target.latitude, generation.Target.name);
        const config = new SweepConfiguration_1.SweepConfiguration(generation.Sweeper.radiusStep, generation.Sweeper.maxRadius, generation.Sweeper.angleStepMOA);
        // Validate and convert label format
        const labelFormat = this.parseLabelFormat(generation.Sweeper.format);
        return { target, config, labelFormat };
    }
    /**
     * Parse and validate label format string
     */
    parseLabelFormat(formatString) {
        const validFormats = Object.values(LabelFormats_1.LabelFormat);
        const format = formatString;
        if (!validFormats.includes(format)) {
            throw new Error(`Invalid label format: ${formatString}. Valid formats: ${validFormats.join(', ')}`);
        }
        return format;
    }
    /**
     * Create output directory for a project
     */
    createProjectDirectory(projectName) {
        // Sanitize project name for filesystem
        const sanitizedName = projectName.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '_');
        const projectDir = path.join(this.outputBaseDir, sanitizedName);
        if (!fs.existsSync(projectDir)) {
            fs.mkdirSync(projectDir, { recursive: true });
        }
        return projectDir;
    }
    /**
     * Generate outputs for a single project
     */
    async generateProjectOutputs(generation, outputDir) {
        const { target, config, labelFormat } = this.convertToModels(generation);
        const kmzGenerator = new KMZGenerator_1.KMZGenerator(target, config, labelFormat);
        const patternGenerator = kmzGenerator.getPatternGenerator();
        // Generate file paths
        const baseName = generation.ProjectName.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '_');
        const csvPath = path.join(outputDir, `${baseName}.csv`);
        const kmlPath = path.join(outputDir, `${baseName}.kml`);
        const kmzPath = path.join(outputDir, `${baseName}.kmz`);
        // Generate outputs
        console.log(`  📄 Generating CSV: ${path.basename(csvPath)}`);
        kmzGenerator.generateCSVFile(csvPath);
        console.log(`  📄 Generating KML: ${path.basename(kmlPath)}`);
        kmzGenerator.generateKMLFile(kmlPath);
        console.log(`  🗺️  Generating KMZ: ${path.basename(kmzPath)}`);
        await kmzGenerator.generateKMZ(kmzPath);
        // Get summary information
        const summary = patternGenerator.getSummary();
        return {
            csvPath,
            kmlPath,
            kmzPath,
            summary
        };
    }
    /**
     * Generate outputs for all projects in the configuration
     */
    async generateAllProjects() {
        console.log('🎯 TargetSweeper-360 - Project Batch Generation');
        console.log('================================================');
        const config = this.loadProjectsConfig();
        const results = [];
        let successful = 0;
        let failed = 0;
        console.log(`\n📋 Found ${config.generations.length} project(s) to process\n`);
        for (let i = 0; i < config.generations.length; i++) {
            const generation = config.generations[i];
            if (!generation) {
                console.error(`❌ Invalid generation at index ${i}`);
                failed++;
                continue;
            }
            console.log(`🔄 Processing Project ${i + 1}/${config.generations.length}: "${generation.ProjectName}"`);
            try {
                // Validate the generation
                this.validateGeneration(generation, i + 1);
                // Create project directory
                const outputDir = this.createProjectDirectory(generation.ProjectName);
                console.log(`  📁 Output directory: ${outputDir}`);
                // Generate outputs
                const outputs = await this.generateProjectOutputs(generation, outputDir);
                results.push({
                    projectName: generation.ProjectName,
                    status: 'success',
                    outputDir,
                    files: {
                        csvPath: outputs.csvPath,
                        kmlPath: outputs.kmlPath,
                        kmzPath: outputs.kmzPath
                    },
                    summary: outputs.summary
                });
                console.log(`  ✅ Project "${generation.ProjectName}" completed successfully`);
                console.log(`     📊 Generated ${outputs.summary.totalPoints} sweep points`);
                console.log(`     🎯 Target: ${outputs.summary.target}`);
                console.log(`     📏 Max Radius: ${outputs.summary.maxRadius}m\n`);
                successful++;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`  ❌ Failed to process "${generation.ProjectName}": ${errorMessage}\n`);
                results.push({
                    projectName: generation.ProjectName,
                    status: 'error',
                    error: errorMessage
                });
                failed++;
            }
        }
        console.log('📈 Batch Generation Summary:');
        console.log(`  ✅ Successful: ${successful}`);
        console.log(`  ❌ Failed: ${failed}`);
        console.log(`  📁 Output directory: ${this.outputBaseDir}`);
        return {
            successful,
            failed,
            results
        };
    }
}
exports.ProjectManager = ProjectManager;
//# sourceMappingURL=ProjectManager.js.map