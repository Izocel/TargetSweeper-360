import { NextFunction, Request, Response } from 'express';
import { ProjectManager } from '../../lib/services/ProjectManager';
import { GetProjectRequest } from '../requests/GetProjectRequest';
import { PutProjectRequest } from '../requests/PutProjectRequest';
import { UploadProjectRequest } from '../requests/UploadProjectRequest';

class ProjectController {

    /**
     * Update a project
     * @param _req The request object
     * @param res The response object
     * @param next The next middleware function
     * @returns A promise that resolves to the response
     */
    static async put(_req: Request, res: Response, next: NextFunction) {
        try {
            const request = new PutProjectRequest(_req.body as any)
            if (!request.isValid || !request.data) {
                return res.status(400).json(request.toObject());
            }

            const results = await ProjectManager.generate(request);
            return res.json(results);
        } catch (error) {
            return next(error);
        }
    }

    static async upload(_req: Request, res: Response, next: NextFunction) {
        try {
            const request = new UploadProjectRequest({ file: _req.file })
            if (!request.isValid || !request.data) {
                return res.status(400).json(request.toObject());
            }

            const results = await ProjectManager.storeFile(request);
            return res.json(results);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * Get project details by name
     * @param _req The request object
     * @param res The response object
     * @param next The next middleware function
     * @returns A promise that resolves to the response
     */
    static async get(_req: Request, res: Response, next: NextFunction) {
        try {
            const request = new GetProjectRequest(_req.query as any)
            if (!request.isValid || !request.data) {
                return res.status(400).json(request.toObject());
            }

            const { name, output, type } = request.data;
            const project = await ProjectManager.getProjectByName(name, type);

            if (!project?.[0]) {
                return res.status(404).json({ message: 'Project not found.' });
            }

            const servePath = project[0].path;

            switch (output) {
                case "download":
                    return res.download(servePath);
                case "file":
                    return res.sendFile(servePath);
                default:
                case "content":
                    switch (type) {
                        case "kml":
                            res.type('application/xml');
                            return res.send(project[0].content);
                        case "json":
                            return res.json(project[0].content);
                        default:
                            return res.send(project[0].content);
                    }
            }
        } catch (error) {
            return next(error);
        }
    }
}

export default ProjectController;
