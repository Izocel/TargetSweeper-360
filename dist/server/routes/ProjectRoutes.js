"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectController_1 = __importDefault(require("../controllers/ProjectController"));
const FileUploadsHandler_1 = __importDefault(require("../storages/FileUploadsHandler"));
class ProjectRoutes {
    static register(router) {
        router.route('/projects')
            .put(ProjectController_1.default.put)
            .get(ProjectController_1.default.get);
        router.route('/projects/upload')
            .put(FileUploadsHandler_1.default.single('file'), ProjectController_1.default.upload);
    }
}
exports.default = ProjectRoutes;
//# sourceMappingURL=ProjectRoutes.js.map