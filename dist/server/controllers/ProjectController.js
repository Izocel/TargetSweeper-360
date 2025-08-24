"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectManager_1 = require("../../lib/services/ProjectManager");
const GetProjectRequest_1 = require("../requests/GetProjectRequest");
const PutProjectRequest_1 = require("../requests/PutProjectRequest");
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
            const request = new PutProjectRequest_1.PutProjectRequest(_req.body);
            console.log(_req.body);
            console.log(request);
            if (!request.isValid || !request.data) {
                return res.status(400).json(request.toObject());
            }
            const results = await ProjectManager_1.ProjectManager.generate(request);
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
            const request = new GetProjectRequest_1.GetProjectRequest(_req.query);
            if (!request.isValid || !request.data) {
                return res.status(400).json(request.toObject());
            }
            const { name, output, type } = request.data;
            const project = await ProjectManager_1.ProjectManager.getProjectByName(name, type);
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