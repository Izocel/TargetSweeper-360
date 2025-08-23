import { AxiosRequestConfig, AxiosResponse } from 'axios';
import ProjectsApi from './ProjectsApi';
export declare class TargetSweeperApi {
    private readonly axiosInstance;
    readonly Projects: ProjectsApi;
    constructor(apiUrl: string, config?: AxiosRequestConfig);
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}
