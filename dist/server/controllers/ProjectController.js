"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectManager_1 = require("../../lib/services/ProjectManager");
const GetProjectRequest_1 = require("../requests/GetProjectRequest");
const PutProjectRequest_1 = require("../requests/PutProjectRequest");
const UploadProjectRequest_1 = require("../requests/UploadProjectRequest");
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
    static async upload(_req, res, next) {
        try {
            const request = new UploadProjectRequest_1.UploadProjectRequest({ file: _req.file });
            if (!request.isValid || !request.data) {
                return res.status(400).json(request.toObject());
            }
            const results = await ProjectManager_1.ProjectManager.storeFile(request);
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
            const projects = await ProjectManager_1.ProjectManager.getProjectByName(name, type);
            if (!projects?.length) {
                return res.status(404).json({ message: 'Project not found.' });
            }
            const project = projects[0];
            const { path, content } = project;
            if (!path) {
                return res.status(404).json({ message: 'Project path not found.' });
            }
            switch (output) {
                case "download":
                    return res.download(path);
                case "file":
                    return res.sendFile(path);
                default:
                case "content":
                    switch (type) {
                        case "kml":
                            res.type('application/xml');
                            return res.send(content);
                        case "json":
                            return res.json(content);
                        default:
                            return res.send(content);
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