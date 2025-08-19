"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectManager_1 = require("../../lib/services/ProjectManager");
class ProjectController {
    static async generateAll(_req, res, next) {
        try {
            const manager = new ProjectManager_1.ProjectManager();
            const result = await manager.generateAllProjects();
            res.json({ success: true, result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = ProjectController;
//# sourceMappingURL=ProjectController.js.map