import * as fs from 'fs';
import * as path from 'path';
import { PutProjectRequest } from '../../server/requests/PutProjectRequest';
import { SweeperConfigs } from '../models/SweeperConfigs';
import { Target } from '../models/Target';
import { KMLGenerator } from './KMLGenerator';

/**
 * Manages project configurations and generates outputs
 */
export class ProjectManager {
    private static outputBaseDir: string = path.join(process.cwd(), 'projects');

    static async generate(request: PutProjectRequest): Promise<{
        projectName: string;
        summary: any;
        files: any[];
    }> {
        const data = request.data!;
        const { name, labelFormat } = data;

        // Create configurations
        const target = new Target(data.target.longitude, data.target.latitude);
        const sweeper = new SweeperConfigs(data.sweeperConfigs.radiusStep, data.sweeperConfigs.maxRadius, data.sweeperConfigs.angleStepMOA);

        // Generators
        const kmlGenerator = new KMLGenerator(target, sweeper, labelFormat);
        const patternGenerator = kmlGenerator.getPatternGenerator();

        // Output paths
        const suffix = Date.now();
        const baseName = name.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '_');
        const projectName = `${baseName}_${suffix}`;
        const outputPath = path.join(ProjectManager.outputBaseDir, projectName);

        // Generate KML files & summary
        const summary = patternGenerator.getSummary();
        const files = await kmlGenerator.generateAllFiles(outputPath, sweeper);

        for (const file of files) {
            console.log(`  📄  Generated: ${path.basename(file.path)}`);
        }

        return {
            projectName,
            summary,
            files,
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