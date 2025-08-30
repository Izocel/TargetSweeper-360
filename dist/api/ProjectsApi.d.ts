import { AxiosInstance, AxiosResponse } from 'axios';
import { GetProjectRequest } from '../server/requests/GetProjectRequest';
import { PutFileProjectRequest } from '../server/requests/PutFileProjectRequest';
import { PutProjectRequest } from '../server/requests/PutProjectRequest';
declare class ProjectsApi {
    private readonly axios;
    constructor(axiosInstance: AxiosInstance);
    get<T = any>(request: GetProjectRequest): Promise<AxiosResponse<T>>;
    put<T = any>(request: PutProjectRequest): Promise<AxiosResponse<T>>;
    putFile<T = any>(request: PutFileProjectRequest): Promise<AxiosResponse<T>>;
}
export default ProjectsApi;
