import * as fs from 'fs';
import * as path from 'path';
import { PutProjectRequest } from '../../server/requests/PutProjectRequest';
import { UploadProjectRequest } from '../../server/requests/UploadProjectRequest';
import { SweeperConfigs } from '../models/SweeperConfigs';
import { Target } from '../models/Target';
import { KMLGenerator } from './KMLGenerator';

export interface StoredProject {
    path?: string;
    extension: string;
    content: string;
    endpoint: string;
}

/**
 * Manages project configurations and generates outputs
 */
export class ProjectManager {
    private static outputBaseDir: string = path.join(process.cwd(), 'projects');

    static async generate(request: PutProjectRequest): Promise<{
        summary: any;
        projectName: string;
        files?: StoredProject[] | void;
    }> {
        const data = request.data!;
        const { name, labelFormat } = data;

        // Create configurations
        const target = new Target(data.target.geo.longitude, data.target.geo.latitude);
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
    static async getProjectByName(name: string, type: string = "kml"): Promise<StoredProject[] | void> {
        const lookoutPath = path.join(ProjectManager.outputBaseDir, `${name}`);

        if (!fs.existsSync(lookoutPath)) {
            throw new Error(`Project with name "${name}" does not exist.`);
        }

        const results: StoredProject[] = [];
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

    static async storeFile(request: UploadProjectRequest): Promise<StoredProject[] | void> {
        const file = request.data!.file as Express.Multer.File;
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