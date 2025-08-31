import { PutProjectRequest } from '../../server/requests/PutProjectRequest';
import { UploadProjectRequest } from '../../server/requests/UploadProjectRequest';
/**
 * Manages project configurations and generates outputs
 */
export declare class ProjectManager {
    private static outputBaseDir;
    static generate(request: PutProjectRequest): Promise<{
        projectName: string;
        summary: any;
        files: any[];
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
        endpoint: string;
    }[] | void>;
    static storeFile(request: UploadProjectRequest): Promise<{
        content: string;
        endpoint: string;
    }[] | void>;
}
