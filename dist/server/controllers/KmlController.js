"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectManager_1 = require("../../lib/services/ProjectManager");
class KmlController {
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
exports.default = KmlController;
//# sourceMappingURL=KmlController.js.map