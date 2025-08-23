import { NextFunction, Request, Response } from 'express';
declare class ProjectController {
    /**
     * Update a project
     * @param _req The request object
     * @param res The response object
     * @param next The next middleware function
     * @returns A promise that resolves to the response
     */
    static put(_req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    /**
     * Get project details by name
     * @param _req The request object
     * @param res The response object
     * @param next The next middleware function
     * @returns A promise that resolves to the response
     */
    static get(_req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
export default ProjectController;
