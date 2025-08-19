import { NextFunction, Request, Response } from 'express';
declare class ProjectController {
    static generateAll(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default ProjectController;
