import { Request, Response, NextFunction } from 'express';
import { ProjectManager } from '../../lib/services/ProjectManager';

class KmlController {
    static async generateAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const manager = new ProjectManager();
            const result = await manager.generateAllProjects();
            res.json({ success: true, result });
        } catch (error) {
            next(error);
        }
    }
}

export default KmlController;
