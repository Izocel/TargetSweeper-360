"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetSweeperApi = void 0;
const axios_1 = __importDefault(require("axios"));
const ProjectsApi_1 = __importDefault(require("./ProjectsApi"));
class TargetSweeperApi {
    constructor(apiUrl, config) {
        this.axiosInstance = axios_1.default.create({
            baseURL: `${apiUrl}/api/`,
            ...config,
        });
        this.Projects = new ProjectsApi_1.default(this.axiosInstance);
    }
    get(url, config) {
        return this.axiosInstance.get(url, config);
    }
    post(url, data, config) {
        return this.axiosInstance.post(url, data, config);
    }
    put(url, data, config) {
        return this.axiosInstance.put(url, data, config);
    }
    delete(url, config) {
        return this.axiosInstance.delete(url, config);
    }
}
exports.TargetSweeperApi = TargetSweeperApi;
//# sourceMappingURL=index.js.map