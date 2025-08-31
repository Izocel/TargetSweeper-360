import { AxiosInstance, AxiosResponse } from 'axios';
import { GetProjectRequest } from '../server/requests/GetProjectRequest';
import { PutProjectRequest } from '../server/requests/PutProjectRequest';
import { UploadProjectRequest } from '../server/requests/UploadProjectRequest';
declare class ProjectsApi {
    private readonly axios;
    constructor(axiosInstance: AxiosInstance);
    get<T = any>(request: GetProjectRequest): Promise<AxiosResponse<T>>;
    put<T = any>(request: PutProjectRequest): Promise<AxiosResponse<T>>;
    upload<T = any>(request: UploadProjectRequest): Promise<AxiosResponse<T>>;
}
export default ProjectsApi;
