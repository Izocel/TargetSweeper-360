import { PutProjectRequest } from '../../server/requests/PutProjectRequest';
import { UploadProjectRequest } from '../../server/requests/UploadProjectRequest';
export interface StoredProject {
    path?: string;
    content: string;
    endpoint: string;
}
/**
 * Manages project configurations and generates outputs
 */
export declare class ProjectManager {
    private static outputBaseDir;
    static generate(request: PutProjectRequest): Promise<{
        summary: any;
        projectName: string;
        files?: StoredProject[] | void;
    }>;
    /**
     * Get project details by name
     * @param name The project name
     * @param type The file type to filter by (default is "kml")
     * @returns The project files and their content
     */
    static getProjectByName(name: string, type?: string): Promise<StoredProject[] | void>;
    static storeFile(request: UploadProjectRequest): Promise<StoredProject[] | void>;
}
