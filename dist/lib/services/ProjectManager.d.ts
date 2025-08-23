import { ProjectConfigs } from '../models/ProjectConfigs';
/**
 * Manages project configurations and generates outputs
 * @param config The project configuration
 * @param outputDir The output directory for generated files
 */
export declare class ProjectManager {
    private static outputBaseDir;
    /**
     * Validate a project generation configuration
     * @param config The project configuration
     */
    static validateConfig(config: ProjectConfigs): {
        valid: boolean;
        errors?: string[];
    };
    /**
     * Generate project files
     * @param configs The project configuration
     */
    static generate(configs: ProjectConfigs): Promise<{
        files: any[];
        summary: any;
    }>;
    /**
     * Get project details by name
     * @param name The project name
     * @param type The file type to filter by (default is ".kml")
     * @returns The project files and their content
     */
    static getProjectByName(name: string, type?: string): Promise<{
        path: string;
        content: string;
    }[] | void>;
}
