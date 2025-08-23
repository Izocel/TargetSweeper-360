import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import ProjectsApi from './ProjectsApi';

export class TargetSweeperApi {
    private readonly axiosInstance: AxiosInstance;
    public readonly Projects: ProjectsApi;

    constructor(apiUrl: string, config?: AxiosRequestConfig) {
        this.axiosInstance = axios.create({
            baseURL: `${apiUrl}/api/`,
            ...config,
        });
        this.Projects = new ProjectsApi(this.axiosInstance);
    }

    public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, config);
    }

    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put<T>(url, data, config);
    }

    public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete<T>(url, config);
    }
}