import { Injectable } from '@angular/core';
import axios from 'axios';

interface ApiResponse<T> {
  status: number;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseURL = 'http://localhost:3000/';

  constructor() {}

  getAll(url: string): any {
    return axios.get(url);
  }

  getOne<T>(url: string, id: number): Promise<ApiResponse<T>> {
    return axios
      .get(`${url}/${id}`)
      .then((response: any) => {
        return { status: response.status, data: response.data };
      })
      .catch((error: any) => {
        throw error;
      }) as Promise<ApiResponse<T>>;
  }

  post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return axios
      .post(url, data)
      .then((response: any) => {
        return { status: response.status, data: response.data };
      })
      .catch((error: any) => {
        throw error;
      }) as Promise<ApiResponse<T>>;
  }

  patch<T>(url: string, id: number, data: any): Promise<ApiResponse<T>> {
    return axios
      .patch(`${url}/${id}`, data)
      .then((response: any) => {
        return { status: response.status, data: response.data };
      })
      .catch((error: any) => {
        throw error;
      }) as Promise<ApiResponse<T>>;
  }

  delete(url: string, id: number): any {
    return axios.delete(`${url}/${id}`);
  }
}
