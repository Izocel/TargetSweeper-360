
import { AxiosInstance, AxiosResponse } from 'axios';
import { GetProjectRequest } from '../server/requests/GetProjectRequest';
import { PutFileProjectRequest } from '../server/requests/PutFileProjectRequest';
import { PutProjectRequest } from '../server/requests/PutProjectRequest';

class ProjectsApi {
    private readonly axios: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axios = axiosInstance;
    }

    get<T = any>(request: GetProjectRequest): Promise<AxiosResponse<T>> {
        request.enforce();
        return this.axios.get<T>('projects', { params: { ...request.data } });
    }
    put<T = any>(request: PutProjectRequest): Promise<AxiosResponse<T>> {
        request.enforce();
        return this.axios.put<T>('projects', { ...request.data });
    }
    putFile<T = any>(request: PutFileProjectRequest): Promise<AxiosResponse<T>> {
        request.enforce();
        return this.axios.put<T>('projects/upload', { ...request.data });
    }
}

export default ProjectsApi;