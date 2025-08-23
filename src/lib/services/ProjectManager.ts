import * as fs from 'fs';
import * as path from 'path';
import { ProjectConfigs } from '../models/ProjectConfigs';
import { KMLGenerator } from './KMLGenerator';

/**
 * Manages project configurations and generates outputs
 * @param config The project configuration
 * @param outputDir The output directory for generated files
 */
export class ProjectManager {
    private static outputBaseDir: string = path.join(process.cwd(), 'projects');

    /**
     * Validate a project generation configuration
     * @param config The project configuration
     */
    static validateConfig(config: ProjectConfigs): { valid: boolean; errors?: string[] } {
        const results = ProjectConfigs.Schema.safeParse(config);
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
    static async generate(configs: ProjectConfigs): Promise<{
        files: any[];
        summary: any;
    }> {
        const validation = this.validateConfig(configs);
        if (!validation.valid) {
            throw new Error(`Invalid project configuration: ${validation.errors?.join('; ')}`);
        }

        const { Target, SweeperConfigs, Name, LabelFormat } = configs;

        // Generators
        const kmlGenerator = new KMLGenerator(Target, SweeperConfigs, LabelFormat);
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
    static async getProjectByName(name: string, type: string = "kml"): Promise<{ path: string; content: string }[] | void> {
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