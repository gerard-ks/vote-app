import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZodType } from 'zod';
import { Z_SCHEMA } from '@core/interceptors/zod-context';
import { API_ENDPOINTS } from '@core/constants/api-endpoint';

@Injectable({ providedIn: 'root' })
export class ApiClientRest {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_ENDPOINTS.BASE_URL;

  public get<T>(path: string, schema: ZodType<T, any, any>, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, {
      params,
      context: new HttpContext().set(Z_SCHEMA, schema),
    });
  }

  public post<T>(path: string, body: any, schema: ZodType<T, any, any>): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, {
      context: new HttpContext().set(Z_SCHEMA, schema),
    });
  }

  public put<T>(path: string, body: any, schema: ZodType<T, any, any>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, {
      context: new HttpContext().set(Z_SCHEMA, schema),
    });
  }

  public patch<T>(path: string, body: any, schema: ZodType<T, any, any>): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, {
      context: new HttpContext().set(Z_SCHEMA, schema),
    });
  }

  public delete<T>(path: string, schema?: ZodType<T, any, any>): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, {
      context: schema ? new HttpContext().set(Z_SCHEMA, schema) : undefined,
    });
  }
}
