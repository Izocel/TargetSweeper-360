"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProjectsApi {
    constructor(axiosInstance) {
        this.axios = axiosInstance;
    }
    get(request) {
        request.enforce();
        return this.axios.get('projects', { params: { ...request.data } });
    }
    put(request) {
        request.enforce();
        return this.axios.put('projects', { ...request.data });
    }
}
exports.default = ProjectsApi;
//# sourceMappingURL=ProjectsApi.js.map