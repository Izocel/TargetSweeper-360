import { Router } from 'express';
import ProjectController from '../controllers/ProjectController';

class ProjectRoutes {
    static register(router: Router) {
        // Example route, add more as needed
        router.get('/projects/generate-all', ProjectController.generateAll);
    }
}

export default ProjectRoutes;
