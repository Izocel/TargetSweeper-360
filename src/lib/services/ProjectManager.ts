import * as fs from 'fs';
import * as path from 'path';
import { LabelFormat } from '../constants/enums/LabelFormats';
import { SweepConfiguration } from '../models/SweepConfiguration';
import { Target } from '../models/Target';
import { KMLGenerator } from './KMLGenerator';

/**
 * Interface matching the projects.json structure
 */
export interface ProjectGeneration {
    Target: Target
    ProjectName: string;
    LabelFormat: LabelFormat;
    Sweeper: SweepConfiguration
}

export interface ProjectsConfig {
    generations: ProjectGeneration[];
}

/**
 * Manages project configurations and generates outputs
 */
export class ProjectManager {
    private outputBaseDir: string;
    private projectsConfigPath: string;

    constructor(projectsConfigPath?: string, outputBaseDir?: string) {
        this.outputBaseDir = outputBaseDir || path.join(process.cwd(), 'projects');
        this.projectsConfigPath = projectsConfigPath || path.join(process.cwd(), 'conf', 'projects.json');
    }

    /**
     * Load and parse the projects configuration file
     */
    loadProjectsConfig(): ProjectsConfig {
        try {
            if (!fs.existsSync(this.projectsConfigPath)) {
                throw new Error(`Projects configuration file not found: ${this.projectsConfigPath}`);
            }

            const configContent = fs.readFileSync(this.projectsConfigPath, 'utf-8');
            const config: ProjectsConfig = JSON.parse(configContent);

            if (!config.generations || !Array.isArray(config.generations)) {
                throw new Error('Invalid projects configuration: missing or invalid generations array');
            }

            return config;
        } catch (error) {
            throw new Error(`Failed to load projects configuration: ${error}`);
        }
    }

    /**
     * Validate a project generation configuration
     */
    private validateGeneration(generation: ProjectGeneration, index: number): void {
        const errors: string[] = [];

        if (!generation.ProjectName || typeof generation.ProjectName !== 'string') {
            errors.push(`Generation ${index}: ProjectName is required and must be a string`);
        }

        if (!generation.Target) {
            errors.push(`Generation ${index}: Target is required`);
        } else {
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
        } else {
            if (typeof generation.Sweeper.radiusStep !== 'number' || generation.Sweeper.radiusStep <= 0) {
                errors.push(`Generation ${index}: Sweeper.radiusStep must be a positive number`);
            }
            if (typeof generation.Sweeper.maxRadius !== 'number' || generation.Sweeper.maxRadius <= 0) {
                errors.push(`Generation ${index}: Sweeper.maxRadius must be a positive number`);
            }
            if (typeof generation.Sweeper.angleStepMOA !== 'number' || generation.Sweeper.angleStepMOA <= 0) {
                errors.push(`Generation ${index}: Sweeper.angleStepMOA must be a positive number`);
            }
            if (!generation.LabelFormat || typeof generation.LabelFormat !== 'string') {
                errors.push(`Generation ${index}: Sweeper.LabelFormat is required and must be a string`);
            }
        }

        if (errors.length > 0) {
            throw new Error(`Validation errors:\n${errors.join('\n')}`);
        }
    }

    /**
     * Convert project generation config to domain models
     */
    private convertToModels(generation: ProjectGeneration): {
        target: Target;
        config: SweepConfiguration;
        labelFormat: LabelFormat;
    } {
        const target = new Target(
            generation.Target.longitude,
            generation.Target.latitude,
            generation.Target.name
        );

        const config = new SweepConfiguration(
            generation.Sweeper.radiusStep,
            generation.Sweeper.maxRadius,
            generation.Sweeper.angleStepMOA
        );

        // Validate and convert label format
        const labelFormat = this.parseLabelFormat(generation.LabelFormat);

        return { target, config, labelFormat };
    }

    /**
     * Parse and validate label format string
     */
    private parseLabelFormat(formatString: string): LabelFormat {
        const validFormats = Object.values(LabelFormat);
        const format = formatString as LabelFormat;

        if (!validFormats.includes(format)) {
            throw new Error(`Invalid label format: ${formatString}. Valid formats: ${validFormats.join(', ')}`);
        }

        return format;
    }

    /**
     * Create output directory for a project
     */
    private createProjectDirectory(projectName: string): string {
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
    async generateProjectOutputs(generation: ProjectGeneration, outputDir: string): Promise<{
        csvPath: string;
        kmlPath: string;
        kmzPath: string;
        summary: any;
    }> {
        const { target, config, labelFormat } = this.convertToModels(generation);
        const kmlGenerator = new KMLGenerator(target, config, labelFormat);
        const patternGenerator = kmlGenerator.getPatternGenerator();

        // Generate file paths
        const baseName = generation.ProjectName.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '_');
        const csvPath = path.join(outputDir, `${baseName}.csv`);
        const kmlPath = path.join(outputDir, `${baseName}.kml`);
        const kmzPath = path.join(outputDir, `${baseName}.kmz`);

        // Generate outputs
        console.log(`  📄 Generating CSV: ${path.basename(csvPath)}`);
        kmlGenerator.generateCSVFile(csvPath);

        console.log(`  📄 Generating KML: ${path.basename(kmlPath)}`);
        kmlGenerator.generateKMLFile(kmlPath);

        console.log(`  🗺️  Generating KMZ: ${path.basename(kmzPath)}`);
        await kmlGenerator.generateKMZ(kmzPath);

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
    async generateAllProjects(): Promise<{
        successful: number;
        failed: number;
        results: Array<{
            projectName: string;
            status: 'success' | 'error';
            outputDir?: string;
            files?: {
                csvPath: string;
                kmlPath: string;
                kmzPath: string;
            };
            summary?: any;
            error?: string;
        }>;
    }> {
        console.log('🎯 TargetSweeper-360 - Project Batch Generation');
        console.log('================================================');

        const config = this.loadProjectsConfig();
        const results: Array<{
            projectName: string;
            status: 'success' | 'error';
            outputDir?: string;
            files?: {
                csvPath: string;
                kmlPath: string;
                kmzPath: string;
            };
            summary?: any;
            error?: string;
        }> = [];

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

            } catch (error) {
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
