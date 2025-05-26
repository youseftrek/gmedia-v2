// lib/apiService.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Define a generic response type
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export class ApiService {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add an interceptor to attach the token
    this.api.interceptors.request.use((config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors globally
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: object): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, {
      params,
    });
    return response.data.data;
  }

  async getNoData<T>(url: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url);
    return response.data.data;
  }

  async post<T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(
      url,
      data,
      config
    );
    return response.data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(
      url,
      config
    );
    return response.data.data;
  }

  // Function for File Uploads
  async saveForm<T>(url: string, model: FormData): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(
      url,
      model,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct Content-Type
        },
      }
    );
    return response.data.data;
  }
}

// Initialize with API base URL - update with your actual API base URL
const apiService = new ApiService(process.env.NEXT_PUBLIC_API_URL || "/api");

export default apiService;
