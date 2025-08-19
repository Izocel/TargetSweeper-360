import { LabelFormat } from '../constants/enums/LabelFormats';
import { SweepConfiguration } from '../models/SweepConfiguration';
import { Target } from '../models/Target';
/**
 * Interface matching the projects.json structure
 */
export interface ProjectGeneration {
    Target: Target;
    ProjectName: string;
    LabelFormat: LabelFormat;
    Sweeper: SweepConfiguration;
}
export interface ProjectsConfig {
    generations: ProjectGeneration[];
}
/**
 * Manages project configurations and generates outputs
 */
export declare class ProjectManager {
    private outputBaseDir;
    private projectsConfigPath;
    constructor(projectsConfigPath?: string, outputBaseDir?: string);
    /**
     * Load and parse the projects configuration file
     */
    loadProjectsConfig(): ProjectsConfig;
    /**
     * Validate a project generation configuration
     */
    private validateGeneration;
    /**
     * Convert project generation config to domain models
     */
    private convertToModels;
    /**
     * Parse and validate label format string
     */
    private parseLabelFormat;
    /**
     * Create output directory for a project
     */
    private createProjectDirectory;
    /**
     * Generate outputs for a single project
     */
    generateProjectOutputs(generation: ProjectGeneration, outputDir: string): Promise<{
        csvPath: string;
        kmlPath: string;
        kmzPath: string;
        summary: any;
    }>;
    /**
     * Generate outputs for all projects in the configuration
     */
    generateAllProjects(): Promise<{
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
    }>;
}
