import { Router } from 'express';
import ProjectController from '../controllers/ProjectController';

class ProjectRoutes {
    static register(router: Router) {
        router.route('/projects')
            .put(ProjectController.put)
            .get(ProjectController.get);
        router.route('/projects/upload')
            .put(ProjectController.putFile);
    }
}

export default ProjectRoutes;
