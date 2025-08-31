import { Router } from 'express';
import ProjectController from '../controllers/ProjectController';
import FileUploadsHandler from '../storages/FileUploadsHandler';

class ProjectRoutes {
    static register(router: Router) {
        router.route('/projects')
            .put(ProjectController.put)
            .get(ProjectController.get);
        router.route('/projects/upload')
            .put(FileUploadsHandler.single('file'), ProjectController.upload);
    }
}

export default ProjectRoutes;
