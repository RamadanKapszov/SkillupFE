import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: Record<string, any>) {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((k) => {
        if (params[k] !== undefined && params[k] !== null) {
          httpParams = httpParams.set(k, params[k]);
        }
      });
    }
    return this.http.get<T>(`${this.base}${url}`, { params: httpParams });
  }

  post<T>(url: string, body?: any) {
    return this.http.post<T>(`${this.base}${url}`, body);
  }

  put<T>(url: string, body?: any) {
    return this.http.put<T>(`${this.base}${url}`, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${this.base}${url}`);
  }
}
