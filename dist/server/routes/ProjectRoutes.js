"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectController_1 = __importDefault(require("../controllers/ProjectController"));
class ProjectRoutes {
    static register(router) {
        // Example route, add more as needed
        router.get('/projects/generate-all', ProjectController_1.default.generateAll);
    }
}
exports.default = ProjectRoutes;
//# sourceMappingURL=ProjectRoutes.js.map