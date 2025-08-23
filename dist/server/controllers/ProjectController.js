"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectManager_1 = require("../../lib/services/ProjectManager");
class ProjectController {
    /**
     * Update a project
     * @param _req The request object
     * @param res The response object
     * @param next The next middleware function
     * @returns A promise that resolves to the response
     */
    static async put(_req, res, next) {
        try {
            const validation = ProjectManager_1.ProjectManager.validateConfig(_req.body);
            if (!validation.valid) {
                return res.status(400).json({ success: false, errors: validation.errors });
            }
            const results = await ProjectManager_1.ProjectManager.generate(_req.body);
            return res.json(results);
        }
        catch (error) {
            return next(error);
        }
    }
    /**
     * Get project details by name
     * @param _req The request object
     * @param res The response object
     * @param next The next middleware function
     * @returns A promise that resolves to the response
     */
    static async get(_req, res, next) {
        try {
            let project = null;
            const name = _req.query.name?.toString();
            const output = _req.query.output?.toString() ?? "content";
            const type = _req.query.type?.toString() ?? "kml";
            if (name) {
                project = await ProjectManager_1.ProjectManager.getProjectByName(name, type);
            }
            if (!project?.[0]) {
                return res.status(404).json({ message: 'Project not found.' });
            }
            const servePath = project[0].path;
            switch (output) {
                case "download":
                    return res.download(servePath);
                case "file":
                    return res.sendFile(servePath);
                default:
                case "content":
                    switch (type) {
                        case "kml":
                            res.type('application/xml');
                            return res.send(project[0].content);
                        case "json":
                            return res.json(project[0].content);
                        default:
                            return res.send(project[0].content);
                    }
            }
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.default = ProjectController;
//# sourceMappingURL=ProjectController.js.map