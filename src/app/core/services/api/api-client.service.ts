import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBase } from './api-config';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly base = getApiBase();

  private url(path: string): string {
    // ensure leading slash
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return `${this.base}${path}`;
  }

  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        const v = params[k];
        if (v !== undefined && v !== null) {
          httpParams = httpParams.append(k, String(v));
        }
      });
    }
    return this.http.get<T>(this.url(path), { params: httpParams });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(this.url(path), body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(this.url(path), body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.url(path));
  }
}
