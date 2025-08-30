"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectController_1 = __importDefault(require("../controllers/ProjectController"));
class ProjectRoutes {
    static register(router) {
        router.route('/projects')
            .put(ProjectController_1.default.put)
            .get(ProjectController_1.default.get);
        router.route('/projects/upload')
            .put(ProjectController_1.default.putFile);
    }
}
exports.default = ProjectRoutes;
//# sourceMappingURL=ProjectRoutes.js.map